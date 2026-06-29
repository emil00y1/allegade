/**
 * Shared on-disk format for a single translated document.
 *
 * One file is written per document per locale at
 * `content/translations/{locale}/{_id}.json`. The file stores only the
 * translated *strings* (keyed by their path inside the document), not a full
 * copy of the document — the live structure, images and references always come
 * fresh from Sanity at request time, and `getTranslated()` overlays these
 * strings on top.
 *
 * This module is imported by both the translation script (Node) and the
 * runtime merge helper, so it must stay dependency-free.
 */

export interface TranslationSlot {
  /** Path to the string inside the document, e.g. ["sections", 0, "heading"]. */
  path: (string | number)[];
  /** The original Danish text (used to detect drift before applying). */
  source: string;
  /** The translated text. */
  value: string;
}

export interface TranslationFile {
  _id: string;
  _type: string;
  /** Locale code, e.g. "en". */
  _locale: string;
  /** Translation provider used, e.g. "google" or "deepl". */
  _provider: string;
  /** Provider target language code, e.g. "en" (Google) or "EN-GB" (DeepL). */
  _target: string;
  /** Hash of the extracted source text + paths; used to skip unchanged docs. */
  _sourceHash: string;
  /**
   * When true, the file is hand-polished and the translation script will never
   * overwrite it. This is how a curated English translation survives re-runs.
   */
  _locked: boolean;
  _generatedAt: string;
  slots: TranslationSlot[];
}
