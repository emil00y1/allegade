/**
 * i18n configuration — the single source of truth for which languages exist.
 *
 * Danish (`da`) is the source language and lives unprefixed at the site root
 * (`/hotel`). Every other language is served under a path prefix (`/en/hotel`)
 * and is produced by the build-time DeepL translation script
 * (`scripts/translate-content.ts`).
 *
 * To add German / Spanish / French later, append a locale below and re-run
 * `npm run translate`. Nothing else in the routing layer needs to change.
 *
 * NOTE: keep this file free of server-only imports — it is shared by the
 * middleware (edge), client components (the language switcher) and the
 * translation script (Node).
 */

export interface LocaleDefinition {
  /** URL prefix + translation folder name, e.g. "en". */
  code: string;
  /** Human label shown in the language switcher. */
  label: string;
  /** Value for the HTML `lang` attribute and `hreflang`. */
  htmlLang: string;
  /** DeepL target language (omit for the source language). */
  deeplTarget?: string;
  /** True for the single source language (Danish). */
  isSource?: boolean;
}

export const LOCALES: LocaleDefinition[] = [
  { code: "da", label: "Dansk", htmlLang: "da", isSource: true },
  { code: "en", label: "English", htmlLang: "en", deeplTarget: "EN-GB" },
  // Add more languages here, e.g.:
  // { code: "de", label: "Deutsch", htmlLang: "de", deeplTarget: "DE" },
  // { code: "es", label: "Español", htmlLang: "es", deeplTarget: "ES" },
  // { code: "fr", label: "Français", htmlLang: "fr", deeplTarget: "FR" },
];

/** DeepL source language code for our content. */
export const SOURCE_DEEPL_LANG = "DA";

export const DEFAULT_LOCALE = LOCALES.find((l) => l.isSource)?.code ?? "da";
export const LOCALE_CODES = LOCALES.map((l) => l.code);
/** Non-default locales — the ones that get a URL prefix. */
export const PREFIXED_LOCALES = LOCALE_CODES.filter((c) => c !== DEFAULT_LOCALE);
/** Locales the translation script should generate files for. */
export const TARGET_LOCALES = LOCALES.filter(
  (l) => l.deeplTarget && l.code !== DEFAULT_LOCALE,
);

/**
 * Sanity document `_type`s that contain user-facing text and should be
 * translated. Keep in sync with the schema in `studio-all-gade`.
 */
export const TRANSLATABLE_TYPES = [
  "homepage",
  "restaurantPage",
  "menuPage",
  "hotelPage",
  "selskaberPage",
  "eventsPage",
  "page",
  "hotelRoom",
  "menuCard",
  "event",
  "venue",
  "jobPosting",
  "post",
  "reusableBlock",
  "siteSettings",
] as const;

export function getLocaleDefinition(code: string): LocaleDefinition | undefined {
  return LOCALES.find((l) => l.code === code);
}

/** First path segment, if it is a known non-default locale; otherwise null. */
export function localeFromPathname(pathname: string): string | null {
  const seg = pathname.split("/")[1];
  return PREFIXED_LOCALES.includes(seg) ? seg : null;
}

/** Strip any leading locale prefix, returning the canonical (Danish) path. */
export function stripLocale(pathname: string): string {
  const loc = localeFromPathname(pathname);
  if (!loc) return pathname || "/";
  const stripped = pathname.slice(loc.length + 1);
  return stripped === "" ? "/" : stripped;
}

/**
 * Prefix a canonical path for the given locale. The default locale is served
 * unprefixed. Any existing locale prefix on the input is replaced.
 */
export function localizePath(pathname: string, locale: string): string {
  const canonical = stripLocale(pathname);
  if (locale === DEFAULT_LOCALE) return canonical;
  if (canonical === "/") return `/${locale}`;
  return `/${locale}${canonical}`;
}
