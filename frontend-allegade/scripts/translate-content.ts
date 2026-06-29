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
 *  - Batch-translates changed strings via the DeepL **paid** API
 *    (up to 50 `text` params per request).
 *  - Writes one JSON file per document per locale to
 *    `content/translations/{locale}/{_id}.json` containing only the translated
 *    strings keyed by their path (not a full document copy).
 *  - Never overwrites a file marked `{ "_locked": true }` — that is how a
 *    hand-polished translation survives future re-runs.
 *
 * Run:  npm run translate
 * Env:  SANITY_PROJECT_ID, SANITY_DATASET, DEEPL_API_KEY   (paid DeepL key)
 *       Optional: TRANSLATE_FORCE=1   re-translate even if unchanged
 *                 DEEPL_API_URL       override endpoint (defaults to paid)
 */

import { createClient } from "@sanity/client";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import {
  SOURCE_DEEPL_LANG,
  TARGET_LOCALES,
  TRANSLATABLE_TYPES,
} from "../src/i18n/config";
import type {
  TranslationFile,
  TranslationSlot,
} from "../src/i18n/translation-format";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

// Paid endpoint — NOT api-free (the free tier retains text for training).
const DEEPL_API_URL =
  process.env.DEEPL_API_URL || "https://api.deepl.com/v2/translate";
const DEEPL_BATCH_SIZE = 50;
const FORCE = process.env.TRANSLATE_FORCE === "1";

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
// TRANSLATE — DeepL batch call (up to 50 text params per request)
// ---------------------------------------------------------------------------

async function translateBatch(
  texts: string[],
  target: string,
): Promise<string[]> {
  if (texts.length === 0) return [];
  const results: string[] = [];

  for (let i = 0; i < texts.length; i += DEEPL_BATCH_SIZE) {
    const chunk = texts.slice(i, i + DEEPL_BATCH_SIZE);
    const body = new URLSearchParams();
    body.append("source_lang", SOURCE_DEEPL_LANG);
    body.append("target_lang", target);
    // Keep DeepL from breaking on stray markup; our spans are plain text but
    // occasional entities (&, <) are handled safely either way.
    body.append("preserve_formatting", "1");
    chunk.forEach((t) => body.append("text", t));

    const data = await deeplRequest(body);
    results.push(...data.translations.map((t) => t.text));
  }
  return results;
}

interface DeepLResponse {
  translations: { text: string; detected_source_language?: string }[];
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

  // 429 = too many requests, 456 = quota, 529 = temporary. Back off and retry.
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
    const target = locale.deeplTarget!;
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
        target,
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
        _deeplTarget: target,
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
