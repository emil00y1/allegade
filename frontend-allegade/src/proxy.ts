import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "next-sanity";
import { DEFAULT_LOCALE, PREFIXED_LOCALES, localizePath } from "@/i18n/config";

const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

const REDIRECTS_QUERY = `*[_type == "redirect"]{ source, destination, permanent }`;

let cachedRedirects: { source: string; destination: string; permanent: boolean }[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

async function getRedirects() {
  const now = Date.now();
  if (cachedRedirects && now - cacheTimestamp < CACHE_TTL) {
    return cachedRedirects;
  }
  cachedRedirects = await client.fetch(REDIRECTS_QUERY);
  cacheTimestamp = now;
  return cachedRedirects!;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ── Locale routing ─────────────────────────────────────────────────────────
  // Danish is served unprefixed (`/hotel`); other languages under a prefix
  // (`/en/hotel`). Resolve the locale and the canonical (locale-less) path, then
  // forward both to the render as request headers so server components can read
  // them via getLocale() / getCanonicalPath().
  const firstSegment = path.split("/")[1];
  const prefix = PREFIXED_LOCALES.includes(firstSegment) ? firstSegment : null;
  const locale = prefix ?? DEFAULT_LOCALE;
  const canonicalPath = prefix ? path.slice(prefix.length + 1) || "/" : path;

  // ── Sanity-driven redirects ─────────────────────────────────────────────────
  // Match against the canonical path so a redirect defined for `/x` also covers
  // `/en/x`, preserving the active language on internal destinations.
  const redirects = await getRedirects();
  const match = redirects.find((r) => r.source === canonicalPath);
  if (match) {
    const url = match.destination.startsWith("http")
      ? match.destination
      : `${request.nextUrl.origin}${localizePath(match.destination, locale)}`;
    return NextResponse.redirect(url, match.permanent ? 308 : 307);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-pathname", canonicalPath);

  if (prefix) {
    // Rewrite /en/hotel -> /hotel internally; the browser URL stays /en/hotel.
    const url = request.nextUrl.clone();
    url.pathname = canonicalPath;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals, static files, and API routes.
     */
    "/((?!_next/|api/|favicon\\.ico|.*\\..*).*)",
  ],
};
