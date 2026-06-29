/**
 * scripts/translate-content.ts
 *
 * Build-time / publish-time translation of Sanity content.
 *
 * What it does
 *  - Reads PUBLISHED content from Sanity (`perspective: 'published'`, drafts
 *    ignored) so editor keystrokes never trigger translation.
 *  - Extracts every translatable string from each document, including the text
 *    spans inside Portable Text blocks, while leaving structure, marks and
 *    links intact.
 *  - Hashes the extracted source text (+ its paths) per document. If the hash
 *    matches the previous run, the document is skipped — only genuinely changed
 *    text is re-translated.
 *  - Batch-translates changed strings via the configured provider
 *    (Google Cloud Translation by default; DeepL optional).
 *  - Writes one JSON file per document per locale to
 *    `content/translations/{locale}/{_id}.json` containing only the translated
 *    strings keyed by their path (not a full document copy).
 *  - Never overwrites a file marked `{ "_locked": true }` — that is how a
 *    hand-polished translation survives future re-runs.
 *
 * Run:  npm run translate
 * Env:  SANITY_PROJECT_ID, SANITY_DATASET
 *       TRANSLATION_PROVIDER=google (default) | deepl
 *       google → GOOGLE_TRANSLATE_API_KEY
 *       deepl  → DEEPL_API_KEY (paid key) [+ optional DEEPL_API_URL]
 *       Optional: TRANSLATE_FORCE=1   re-translate even if unchanged
 */

import { createClient } from "@sanity/client";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import {
  SOURCE_DEEPL_LANG,
  SOURCE_GOOGLE_LANG,
  TARGET_LOCALES,
  TRANSLATABLE_TYPES,
  type LocaleDefinition,
} from "../src/i18n/config";
import type {
  TranslationFile,
  TranslationSlot,
} from "../src/i18n/translation-format";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const PROVIDER = (process.env.TRANSLATION_PROVIDER || "google").toLowerCase();
const FORCE = process.env.TRANSLATE_FORCE === "1";

// Google Cloud Translation v2 (Basic) — simple API-key auth.
const GOOGLE_API_URL =
  process.env.GOOGLE_TRANSLATE_API_URL ||
  "https://translation.googleapis.com/language/translate/v2";
// v2 allows up to 128 segments/request; we also cap total characters per
// request to stay well within the payload limit.
const GOOGLE_MAX_SEGMENTS = 100;
const GOOGLE_MAX_CHARS = 28_000;

// DeepL (optional alternative provider). Paid endpoint — NOT api-free, which
// retains text for training.
const DEEPL_API_URL =
  process.env.DEEPL_API_URL || "https://api.deepl.com/v2/translate";
const DEEPL_BATCH_SIZE = 50;

// Keys that must NEVER be translated, anywhere in a document. This includes
// Sanity system keys, references/assets, identifiers, URLs/contacts, enum
// values, and the structural keys of Portable Text (style/marks/listItem),
// which must be preserved verbatim or rendering breaks.
const SKIP_KEYS = new Set<string>([
  // System / meta
  "_type",
  "_key",
  "_ref",
  "_id",
  "_rev",
  "_createdAt",
  "_updatedAt",
  "_weak",
  "_strengthenOnPublish",
  "_originalId",
  // References / media
  "asset",
  "hotspot",
  "crop",
  "pageReference",
  "block",
  // Portable Text structure (preserve verbatim)
  "marks",
  "markDefs",
  "style",
  "listItem",
  "level",
  // Identifiers / URLs / contacts
  "slug",
  "identifier",
  "url",
  "href",
  "ctaUrl",
  "linkUrl",
  "applicationUrl",
  "applicationEmail",
  "email",
  "phone",
  "cvr",
  "logoImageUrl",
  "faviconUrl",
  "headingFontUrl",
  "bodyFontUrl",
  "accentFontUrl",
  "headingFontFamily",
  "bodyFontFamily",
  "accentFontFamily",
  "googleAnalyticsId",
  // Enum / configuration values (not user-facing prose)
  "roomType",
  "menuType",
  "employmentType",
  "displayStyle",
  "platform",
  "colorTheme",
  "fontPairing",
  "primaryCtaButton",
  "category",
  "iconName",
  "icon",
  "alignment",
  "maxWidth",
  "backgroundColor",
  "language",
]);

// ---------------------------------------------------------------------------
// SANITY CLIENT — published only
// ---------------------------------------------------------------------------

const sanity = createClient({
  projectId: requireEnv("SANITY_PROJECT_ID"),
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN, // optional; only needed for private datasets
});

// ---------------------------------------------------------------------------
// EXTRACT — walk a document and collect translatable strings with their paths
// ---------------------------------------------------------------------------

function collect(
  node: unknown,
  trail: (string | number)[],
  out: TranslationSlot[],
): void {
  if (typeof node === "string") {
    if (node.trim()) out.push({ path: trail, source: node, value: node });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => collect(item, [...trail, i], out));
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, val] of Object.entries(node)) {
      if (SKIP_KEYS.has(key)) continue;
      collect(val, [...trail, key], out);
    }
  }
}

function hashSlots(slots: TranslationSlot[]): string {
  const material = slots.map((s) => [s.path.join("."), s.source]);
  return createHash("sha256").update(JSON.stringify(material)).digest("hex");
}

// ---------------------------------------------------------------------------
// TRANSLATE — provider dispatch (Google Cloud Translation by default)
// ---------------------------------------------------------------------------

/** Translate a list of strings into `locale`, preserving order. */
async function translateBatch(
  texts: string[],
  locale: LocaleDefinition,
): Promise<string[]> {
  if (texts.length === 0) return [];
  if (PROVIDER === "google") return googleTranslate(texts, locale.googleTarget!);
  if (PROVIDER === "deepl") return deeplTranslate(texts, locale.deeplTarget!);
  throw new Error(
    `Unknown TRANSLATION_PROVIDER "${PROVIDER}" (expected "google" or "deepl")`,
  );
}

/** True if the locale has the target code the active provider needs. */
function localeSupported(locale: LocaleDefinition): boolean {
  return PROVIDER === "google" ? !!locale.googleTarget : !!locale.deeplTarget;
}

// ── Google Cloud Translation v2 ──────────────────────────────────────────────

interface GoogleResponse {
  data: { translations: { translatedText: string }[] };
}

async function googleTranslate(
  texts: string[],
  target: string,
): Promise<string[]> {
  const results: string[] = [];
  // Chunk by both segment count and total characters to respect v2 limits.
  let chunk: string[] = [];
  let chars = 0;
  const flush = async () => {
    if (chunk.length === 0) return;
    results.push(...(await googleRequest(chunk, target)));
    chunk = [];
    chars = 0;
  };
  for (const t of texts) {
    if (
      chunk.length >= GOOGLE_MAX_SEGMENTS ||
      (chunk.length > 0 && chars + t.length > GOOGLE_MAX_CHARS)
    ) {
      await flush();
    }
    chunk.push(t);
    chars += t.length;
  }
  await flush();
  return results;
}

async function googleRequest(
  chunk: string[],
  target: string,
  attempt = 0,
): Promise<string[]> {
  const key = requireEnv("GOOGLE_TRANSLATE_API_KEY");
  const res = await fetch(`${GOOGLE_API_URL}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: chunk,
      source: SOURCE_GOOGLE_LANG,
      target,
      format: "text", // plain text — do not HTML-escape entities
    }),
  });

  // 429 = rate limit, 5xx = transient. Back off and retry.
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    const wait = 2 ** attempt * 1000;
    console.warn(`  Google Translate ${res.status}; retrying in ${wait}ms…`);
    await sleep(wait);
    return googleRequest(chunk, target, attempt + 1);
  }
  if (!res.ok) {
    throw new Error(`Google Translate ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as GoogleResponse;
  return data.data.translations.map((t) => t.translatedText);
}

// ── DeepL (optional) ─────────────────────────────────────────────────────────

interface DeepLResponse {
  translations: { text: string; detected_source_language?: string }[];
}

async function deeplTranslate(
  texts: string[],
  target: string,
): Promise<string[]> {
  const results: string[] = [];
  for (let i = 0; i < texts.length; i += DEEPL_BATCH_SIZE) {
    const chunk = texts.slice(i, i + DEEPL_BATCH_SIZE);
    const body = new URLSearchParams();
    body.append("source_lang", SOURCE_DEEPL_LANG);
    body.append("target_lang", target);
    body.append("preserve_formatting", "1");
    chunk.forEach((t) => body.append("text", t));

    const data = await deeplRequest(body);
    results.push(...data.translations.map((t) => t.text));
  }
  return results;
}

async function deeplRequest(
  body: URLSearchParams,
  attempt = 0,
): Promise<DeepLResponse> {
  const res = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${requireEnv("DEEPL_API_KEY")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  // 429 = too many requests, 529 = temporary. Back off and retry.
  if ((res.status === 429 || res.status === 529) && attempt < 5) {
    const wait = 2 ** attempt * 1000;
    console.warn(`  DeepL ${res.status}; retrying in ${wait}ms…`);
    await sleep(wait);
    return deeplRequest(body, attempt + 1);
  }
  if (!res.ok) {
    throw new Error(`DeepL ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as DeepLResponse;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function run(): Promise<void> {
  const docs = await sanity.fetch<Record<string, unknown>[]>(
    `*[_type in $types && !(_id in path("drafts.**"))]`,
    { types: [...TRANSLATABLE_TYPES] },
  );
  console.log(
    `Fetched ${docs.length} published document(s) of types: ${TRANSLATABLE_TYPES.join(", ")}`,
  );

  for (const locale of TARGET_LOCALES) {
    if (!localeSupported(locale)) {
      console.warn(
        `[${locale.code}] no ${PROVIDER} target configured — skipping.`,
      );
      continue;
    }
    const target = PROVIDER === "google" ? locale.googleTarget! : locale.deeplTarget!;
    const dir = path.join(process.cwd(), "content", "translations", locale.code);
    await mkdir(dir, { recursive: true });

    let translated = 0;
    let skipped = 0;
    let locked = 0;
    let empty = 0;

    for (const doc of docs) {
      const id = doc._id as string;
      const file = path.join(dir, `${id}.json`);

      const slots: TranslationSlot[] = [];
      collect(doc, [], slots);

      if (slots.length === 0) {
        empty++;
        continue;
      }

      const sourceHash = hashSlots(slots);

      if (existsSync(file)) {
        const prev = JSON.parse(
          await readFile(file, "utf8"),
        ) as Partial<TranslationFile>;
        if (prev._locked) {
          locked++;
          continue;
        }
        if (!FORCE && prev._sourceHash === sourceHash) {
          skipped++;
          continue;
        }
      }

      const translatedTexts = await translateBatch(
        slots.map((s) => s.source),
        locale,
      );
      const filledSlots: TranslationSlot[] = slots.map((s, i) => ({
        path: s.path,
        source: s.source,
        value: translatedTexts[i] ?? s.source,
      }));

      const output: TranslationFile = {
        _id: id,
        _type: doc._type as string,
        _locale: locale.code,
        _provider: PROVIDER,
        _target: target,
        _sourceHash: sourceHash,
        _locked: false,
        _generatedAt: new Date().toISOString(),
        slots: filledSlots,
      };

      await writeFile(file, JSON.stringify(output, null, 2) + "\n");
      translated++;
    }

    console.log(
      `[${locale.code}] translated ${translated}, skipped ${skipped} (unchanged), locked ${locked}, no-text ${empty}`,
    );
  }
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
