/**
 * Server-side locale helpers.
 *
 * The locale and the canonical (locale-less) path are resolved once in
 * `middleware.ts` and forwarded to every request via headers, so server
 * components and `generateMetadata` can read them without a `[locale]` route
 * param.
 */
import "server-only";
import { headers } from "next/headers";
import { DEFAULT_LOCALE } from "./config";

export async function getLocale(): Promise<string> {
  const h = await headers();
  return h.get("x-locale") || DEFAULT_LOCALE;
}

/** The current path with any locale prefix stripped, e.g. "/hotel". */
export async function getCanonicalPath(): Promise<string> {
  const h = await headers();
  return h.get("x-pathname") || "/";
}
