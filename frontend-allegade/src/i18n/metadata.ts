/**
 * SEO helpers for localized metadata.
 *
 * Each language variant gets its own canonical URL plus a full set of
 * `hreflang` alternates so search engines index every language under its own
 * path. Feed the result into `generateMetadata` via `alternates`.
 */
import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, localizePath } from "./config";

export const SITE_URL = "https://allegade10.dk";

/**
 * Build `alternates` for a page.
 *
 * @param canonicalPath locale-less path, e.g. "/hotel" (from `getCanonicalPath`)
 * @param locale        the locale being rendered, e.g. "en"
 */
export function languageAlternates(
  canonicalPath: string,
  locale: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l.htmlLang] = SITE_URL + localizePath(canonicalPath, l.code);
  }
  // x-default points at the source (Danish) URL.
  languages["x-default"] = SITE_URL + localizePath(canonicalPath, DEFAULT_LOCALE);

  return {
    canonical: SITE_URL + localizePath(canonicalPath, locale),
    languages,
  };
}
