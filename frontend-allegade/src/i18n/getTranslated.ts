/**
 * Runtime merge helper.
 *
 * `getTranslated(doc, locale)` returns the Sanity document unchanged for the
 * Danish source locale. For any other locale it loads the matching
 * `content/translations/{locale}/{_id}.json` file and overlays the translated
 * strings onto a clone of the live document, preserving all structure, images,
 * marks and links.
 *
 * Server-only: it reads translation files from disk. The files are bundled into
 * the serverless function via `outputFileTracingIncludes` in `next.config.ts`.
 */
import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE } from "./config";
import type { TranslationFile } from "./translation-format";

// Translation files are immutable for the lifetime of a deployment, so caching
// per (locale, id) avoids re-reading/parsing on every request.
const cache = new Map<string, TranslationFile | null>();

function loadTranslation(locale: string, id: string): TranslationFile | null {
  const key = `${locale}::${id}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const file = path.join(
    process.cwd(),
    "content",
    "translations",
    locale,
    `${id}.json`,
  );
  let parsed: TranslationFile | null = null;
  try {
    if (existsSync(file)) {
      parsed = JSON.parse(readFileSync(file, "utf8")) as TranslationFile;
    }
  } catch {
    parsed = null;
  }
  cache.set(key, parsed);
  return parsed;
}

/**
 * Strip Vercel stega payloads (runs of zero-width characters appended to
 * strings for visual editing) so source comparison works in preview mode too.
 */
const STEGA_CHARS = new RegExp(
  "[\\u200B\\u200C\\u200D\\u2060\\u2061\\u2062\\u2063\\u2064\\uFEFF]",
  "g",
);
function cleanStega(s: string): string {
  return s.replace(STEGA_CHARS, "");
}

function setAtPath(
  root: unknown,
  p: (string | number)[],
  value: string,
  source: string,
): void {
  let cur = root as Record<string | number, unknown> | undefined;
  for (let i = 0; i < p.length - 1; i++) {
    if (cur == null || typeof cur !== "object") return;
    cur = cur[p[i]] as Record<string | number, unknown> | undefined;
  }
  if (cur == null || typeof cur !== "object") return;
  const last = p[p.length - 1];
  const existing = cur[last];
  if (typeof existing !== "string") return;
  // Only override when the live source text still matches what was translated.
  // If the document drifted (e.g. an editor reordered sections), fall back to
  // Danish for that string rather than rendering the wrong translation.
  if (cleanStega(existing) !== source) return;
  cur[last] = value;
}

export function getTranslated<T>(doc: T, locale: string): T {
  if (!doc || locale === DEFAULT_LOCALE) return doc;
  const id = (doc as { _id?: string })?._id;
  if (!id) return doc;

  const translation = loadTranslation(locale, id);
  if (!translation || !translation.slots?.length) return doc;

  const clone = structuredClone(doc);
  for (const slot of translation.slots) {
    setAtPath(clone, slot.path, slot.value, slot.source);
  }
  return clone;
}

/** Convenience for translating an array of documents (rooms, menus, events…). */
export function getManyTranslated<T>(docs: T[] | undefined, locale: string): T[] {
  if (!docs) return [];
  if (locale === DEFAULT_LOCALE) return docs;
  return docs.map((d) => getTranslated(d, locale));
}
