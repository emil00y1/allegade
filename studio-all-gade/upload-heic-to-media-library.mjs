#!/usr/bin/env node
/**
 * Batch-convert HEIC files to JPEG and upload them into the Sanity dataset
 * used by sanity-plugin-media, attaching tags so they are filterable in the
 * Media browser.
 *
 * Usage:
 *   SANITY_AUTH_TOKEN=sk... node upload-heic-to-media-library.mjs \
 *     --dir "C:/path/to/heic-folder" \
 *     --tag Restaurant
 *
 * Flags:
 *   --dir          Folder to scan for *.heic/*.heif (recursive).
 *   --tag          Tag name to attach. Must match an existing media.tag
 *                  document's name.current (case-insensitive). Repeat or
 *                  comma-separate for multiple tags.
 *   --quality      JPEG quality 0-1 (default 0.9)
 *   --concurrency  Parallel uploads (default 3)
 *   --dry-run      Convert but do not upload.
 *   --create-missing-tags  Create a media.tag doc if the tag name doesn't exist.
 */

import {createClient} from '@sanity/client'
import sharp from 'sharp'
import pLimit from 'p-limit'
import {readFile, readdir, stat} from 'node:fs/promises'
import {basename, extname, join} from 'node:path'
import {parseArgs} from 'node:util'

const PROJECT_ID = 'b0bkhf04'
const DATASET = 'production'

const {values} = parseArgs({
  options: {
    dir: {type: 'string'},
    tag: {type: 'string', default: ''},
    quality: {type: 'string', default: '0.9'},
    concurrency: {type: 'string', default: '3'},
    'dry-run': {type: 'boolean', default: false},
    'create-missing-tags': {type: 'boolean', default: false},
  },
})

if (!values.dir) {
  console.error('Missing --dir')
  process.exit(1)
}

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('Missing SANITY_AUTH_TOKEN env var')
  process.exit(1)
}

const tagNames = values.tag
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean)

const quality = Number(values.quality)
const limit = pLimit(Number(values.concurrency))

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-03-01',
  useCdn: false,
  token,
})

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function resolveTagRefs(names) {
  if (!names.length) return []
  const existing = await client.fetch(
    `*[_type == "media.tag" && lower(name.current) in $slugs]{_id, "slug": name.current, "title": name.current}`,
    {slugs: names.map((n) => slugify(n))},
  )
  const byLower = new Map(existing.map((t) => [t.slug.toLowerCase(), t]))
  const refs = []
  for (const name of names) {
    const slug = slugify(name)
    let tag = byLower.get(slug)
    if (!tag) {
      if (!values['create-missing-tags']) {
        throw new Error(
          `Tag "${name}" not found (slug: ${slug}). Existing match not found. ` +
            `Pass --create-missing-tags to create it.`,
        )
      }
      tag = await client.create({
        _type: 'media.tag',
        name: {_type: 'slug', current: slug},
      })
      console.log(`+ created media.tag "${name}" (${tag._id})`)
      byLower.set(slug, tag)
    }
    refs.push({_type: 'reference', _ref: tag._id, _weak: true})
  }
  return refs
}

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(p)))
    else if (/\.(heic|heif|jpg|jpeg|png|webp|gif|tiff|bmp|svg)$/i.test(entry.name)) out.push(p)
  }
  return out
}

async function convertHeicToJpeg(filePath) {
  const buf = await readFile(filePath)
  return await sharp(buf)
    .rotate() // auto-rotate based on EXIF
    .jpeg({quality: Math.round(quality * 100)})
    .toBuffer()
}

async function processOne(filePath, tagRefs) {
  const ext = extname(filePath).toLowerCase()
  const name = basename(filePath)
  try {
    let buffer
    let contentType
    let assetType = 'image'
    let uploadedName = name

    if (/\.(heic|heif)$/i.test(ext)) {
      try {
        buffer = await convertHeicToJpeg(filePath)
        contentType = 'image/jpeg'
        uploadedName = basename(filePath, ext) + '.jpg'
        console.log(`✓ converted ${name} → ${uploadedName} (${(buffer.length / 1024).toFixed(0)} KB)`)
      } catch (convErr) {
        // Fallback: upload as file asset if conversion fails
        buffer = await readFile(filePath)
        contentType = 'image/heic'
        assetType = 'file'
        console.log(`⚠ conversion failed, uploading as file: ${name} (${(buffer.length / 1024).toFixed(0)} KB)`)
      }
    } else {
      buffer = await readFile(filePath)
      const mimeMap = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.tiff': 'image/tiff',
        '.bmp': 'image/bmp',
        '.svg': 'image/svg+xml',
      }
      contentType = mimeMap[ext] || 'image/jpeg'
      console.log(`✓ read ${name} (${(buffer.length / 1024).toFixed(0)} KB)`)
    }

    if (values['dry-run']) return {file: filePath, status: 'dry-run'}

    const asset = await client.assets.upload(assetType, buffer, {
      filename: uploadedName,
      contentType,
    })

    if (tagRefs.length) {
      await client
        .patch(asset._id)
        .setIfMissing({opt: {media: {tags: []}}})
        .set({'opt.media.tags': tagRefs})
        .commit()
    }

    console.log(`  ↑ uploaded ${asset._id}`)
    return {file: filePath, id: asset._id, status: 'ok'}
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`)
    return {file: filePath, status: 'error', error: err.message}
  }
}

;(async () => {
  try {
    await stat(values.dir)
  } catch {
    console.error(`Directory not found: ${values.dir}`)
    process.exit(1)
  }

  const files = await walk(values.dir)
  if (!files.length) {
    console.log(`No .heic/.heif files found under ${values.dir}`)
    return
  }

  const tagRefs = await resolveTagRefs(tagNames)

  console.log(
    `Found ${files.length} HEIC file(s). Tags: [${tagNames.join(', ') || '<none>'}]. ` +
      `Concurrency: ${values.concurrency}. Dry run: ${values['dry-run']}.`,
  )

  const results = await Promise.all(files.map((f) => limit(() => processOne(f, tagRefs))))
  const ok = results.filter((r) => r.status === 'ok').length
  const failed = results.filter((r) => r.status === 'error').length
  console.log(
    `\nDone. Uploaded: ${ok}. Failed: ${failed}. Skipped/dry: ${results.length - ok - failed}.`,
  )
})()
