#!/usr/bin/env node
/**
 * Upload video files to Sanity Media Library with tags.
 * Supports MOV, MP4, WebM, and other video formats.
 *
 * Usage:
 *   SANITY_AUTH_TOKEN=sk... node upload-videos-to-media-library.mjs \
 *     --dir "C:/path/to/videos" \
 *     --tag Selskabslokaler
 *
 * Flags:
 *   --dir          Folder to scan for video files (recursive).
 *   --tag          Tag name(s) to attach. Comma-separate for multiple.
 *   --concurrency  Parallel uploads (default 2, videos are large).
 *   --dry-run      Test without uploading.
 */

import {createClient} from '@sanity/client'
import pLimit from 'p-limit'
import {readFile, readdir} from 'node:fs/promises'
import {basename, join} from 'node:path'
import {parseArgs} from 'node:util'

const PROJECT_ID = 'b0bkhf04'
const DATASET = 'production'

const {values} = parseArgs({
  options: {
    dir: {type: 'string'},
    tag: {type: 'string', default: ''},
    concurrency: {type: 'string', default: '2'},
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
    `*[_type == "media.tag" && lower(name.current) in $slugs]{_id, "slug": name.current}`,
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
          `Tag "${name}" not found (slug: ${slug}). ` +
            `Pass --create-missing-tags to create it.`,
        )
      }
      tag = await client.create({
        _type: 'media.tag',
        name: {_type: 'slug', current: slug},
      })
      console.log(`+ created media.tag "${name}" (${tag._id})`)
    }
    refs.push({_type: 'reference', _ref: tag._id, _weak: true})
  }
  return refs
}

async function walk(dir) {
  const out = []
  const videoExts = /\.(mov|mp4|webm|mkv|avi|flv|wmv|m4v)$/i
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(p)))
    else if (videoExts.test(entry.name)) out.push(p)
  }
  return out
}

async function processOne(filePath, tagRefs) {
  const name = basename(filePath)
  try {
    const buffer = await readFile(filePath)
    console.log(`✓ read ${name} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`)

    if (values['dry-run']) return {file: filePath, status: 'dry-run'}

    const asset = await client.assets.upload('file', buffer, {
      filename: name,
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
  const files = await walk(values.dir)
  if (!files.length) {
    console.log(`No video files found under ${values.dir}`)
    return
  }

  const tagRefs = await resolveTagRefs(tagNames)

  console.log(
    `Found ${files.length} video file(s). Tags: [${tagNames.join(', ') || '<none>'}]. ` +
      `Concurrency: ${values.concurrency}. Dry run: ${values['dry-run']}.`,
  )

  const results = await Promise.all(files.map((f) => limit(() => processOne(f, tagRefs))))
  const ok = results.filter((r) => r.status === 'ok').length
  const failed = results.filter((r) => r.status === 'error').length
  console.log(
    `\nDone. Uploaded: ${ok}. Failed: ${failed}. Skipped/dry: ${results.length - ok - failed}.`,
  )
})()
