This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Localization (multi-language)

Danish is the single source of truth in Sanity. Other languages are **not**
edited in Sanity — they are produced at publish time by translating the Danish
content with the DeepL API and committing the result to the repo as JSON. The
site then serves each language under its own URL.

- Danish (source): served unprefixed, e.g. `/hotel`
- English: served under `/en`, e.g. `/en/hotel`
- Add German/Spanish/French later by adding a locale to `src/i18n/config.ts`
  and re-running `npm run translate` — no routing changes needed.

### How it fits together

| Piece | File |
| --- | --- |
| Locales + helpers (single source of truth) | `src/i18n/config.ts` |
| Build-time translation script | `scripts/translate-content.ts` |
| Generated translations (committed) | `content/translations/{locale}/{_id}.json` |
| Runtime merge helper | `src/i18n/getTranslated.ts` |
| Locale routing (URL prefix → header) | `src/middleware.ts` |
| `hreflang` + canonical metadata | `src/i18n/metadata.ts` |
| Language switcher | `src/components/LanguageSwitcher.tsx` |
| Publish → translate → deploy automation | `../.github/workflows/translate.yml` |

The middleware resolves the locale from the URL prefix and forwards it (plus the
canonical, locale-less path) as request headers. Pages read it with
`getLocale()` / `getCanonicalPath()` and call `getTranslated(doc, locale)` on
the documents they fetch. For Danish, `getTranslated` returns the document
untouched; for other locales it overlays the translated strings. Translated HTML
is rendered server-side (the whole app is `force-dynamic`), so every language is
fully indexable, and `generateMetadata` emits per-language `<title>`, meta
description, canonical URL and `hreflang` alternates.

### Translation provider

The translator is pluggable via `TRANSLATION_PROVIDER`:

- `google` (default) — Google Cloud Translation v2 (Basic), API-key auth. Has a
  recurring 500k-characters/month free tier; because we only re-translate what
  changed, this is effectively free in steady state.
- `deepl` — DeepL paid endpoint (`api.deepl.com`), best quality for
  Danish→European languages.

### Environment variables

```
SANITY_PROJECT_ID=b0bkhf04
SANITY_DATASET=production

# Provider (default: google)
TRANSLATION_PROVIDER=google
GOOGLE_TRANSLATE_API_KEY=<your Google Cloud Translation API key>

# …or DeepL instead:
# TRANSLATION_PROVIDER=deepl
# DEEPL_API_KEY=<paid DeepL key>      # NOT a free (api-free) key — it retains text

# SANITY_API_READ_TOKEN=...           # only if the dataset is private
```

### Running a translation

```bash
# from frontend-allegade/, with the env vars above exported
npm run translate
```

What it does:

- Reads **published** Sanity content only (drafts are ignored, so editor
  keystrokes never trigger translation).
- Extracts every translatable string, including the text spans inside Portable
  Text, preserving structure, marks and links.
- Hashes each document's source text and **re-translates only what changed**.
- Batches up to 50 strings per DeepL request.
- Writes `content/translations/{locale}/{_id}.json`.

Force a full re-translation with `TRANSLATE_FORCE=1 npm run translate`.

### Polishing a translation (and keeping it)

`npm run translate` ships raw DeepL output. To hand-polish a page and stop the
script from ever overwriting it:

1. Open the file under `content/translations/{locale}/{_id}.json`.
2. Edit the `value` of the slots you want to improve.
3. Set `"_locked": true` at the top of the file.

Locked files are skipped on every future run, so curated translations survive
even when the Danish source changes later.

### Automation (publish in Sanity → site updates)

`.github/workflows/translate.yml` runs `npm run translate`, commits any changed
translation files and lets the resulting commit trigger a Vercel deploy. It
fires on `repository_dispatch` (event type `sanity-publish`) and can also be run
manually from the Actions tab.

Add these repository secrets: `SANITY_PROJECT_ID`, `SANITY_DATASET`,
`GOOGLE_TRANSLATE_API_KEY` (and optionally `SANITY_API_READ_TOKEN`,
`VERCEL_DEPLOY_HOOK_URL`, plus `DEEPL_API_KEY` and a `TRANSLATION_PROVIDER`
repository variable if you switch providers).

Wire up the Sanity webhook (Manage → API → Webhooks) so publishing fires the
workflow:

- **URL:** `https://api.github.com/repos/emil00y1/allegade/dispatches`
- **Trigger on:** Create / Update / Delete · **Filter:** `_type in [...]`
  (the same types as `TRANSLATABLE_TYPES`)
- **HTTP method:** `POST`
- **HTTP headers:**
  - `Authorization: Bearer <GitHub PAT with repo scope>`
  - `Accept: application/vnd.github+json`
- **Projection / body:** `{ "event_type": "sanity-publish" }`

Manual `npm run translate` keeps working for local runs.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
