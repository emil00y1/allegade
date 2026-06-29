# Translations

Generated, committed translation files. **Do not edit by hand unless you also set
`"_locked": true`** (see below).

```
content/translations/
  en/
    <documentId>.json     # one file per Sanity document
  de/                     # added automatically when you add a locale
    ...
```

Danish (`da`) is the source language and has no folder — it is served straight
from Sanity.

## File format

Each file stores only the translated strings, keyed by their path inside the
document. The live document structure, images and references always come fresh
from Sanity at request time; `getTranslated()` overlays these strings on top.

```jsonc
{
  "_id": "hotelPage",
  "_type": "hotelPage",
  "_locale": "en",
  "_deeplTarget": "EN-GB",
  "_sourceHash": "…",        // change detection — do not edit
  "_locked": false,          // set true to protect a hand-polished file
  "_generatedAt": "…",
  "slots": [
    { "path": ["seo", "metaTitle"], "source": "Hotel …", "value": "Hotel …" },
    { "path": ["sections", 0, "heading"], "source": "…", "value": "…" }
  ]
}
```

## Locking a polished translation

`npm run translate` ships raw DeepL output. To replace a string with a curated
translation and stop the script from ever overwriting it:

1. Edit the `value` of the slots you want to improve.
2. Set `"_locked": true` at the top of the file.

On the next run the script sees `_locked` and skips the document entirely, so
your polish survives — even if the Danish source later changes.
