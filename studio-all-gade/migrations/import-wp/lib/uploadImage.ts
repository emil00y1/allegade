import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {createClient} from '@sanity/client'
import pLimit from 'p-limit'

// Load .env file manually (no dotenv dependency needed)
try {
  const envPath = resolve(import.meta.dirname, '../../../.env')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] || '').replace(/^["']|["']$/g, '')
    }
  }
} catch {
  // .env file not found — token must be set via environment
}

// Limit concurrent image uploads
const limit = pLimit(3)

// Cache to avoid re-uploading the same WP media ID
const uploadCache = new Map<number, {_type: 'image'; asset: {_type: 'reference'; _ref: string}}>()

// Direct Sanity client for asset uploads (migration context client doesn't support assets)
const assetClient = createClient({
  projectId: 'b0bkhf04',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

/**
 * Download an image from a URL and upload it to Sanity's asset pipeline.
 * Returns a Sanity image object ready to be used in a document.
 */
export async function uploadImageFromUrl(
  sourceUrl: string,
  wpMediaId: number,
  filename?: string,
): Promise<{_type: 'image'; asset: {_type: 'reference'; _ref: string}} | undefined> {
  if (uploadCache.has(wpMediaId)) {
    return uploadCache.get(wpMediaId)
  }

  return limit(async () => {
    if (uploadCache.has(wpMediaId)) {
      return uploadCache.get(wpMediaId)
    }

    try {
      console.log(`  Uploading image: ${sourceUrl}`)
      const response = await fetch(sourceUrl)
      if (!response.ok) {
        console.error(`  Failed to fetch image ${sourceUrl}: ${response.status}`)
        return undefined
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const contentType = response.headers.get('content-type') || 'image/jpeg'

      const asset = await assetClient.assets.upload('image', buffer, {
        filename: filename || sourceUrl.split('/').pop() || 'image',
        contentType,
      })

      const imageRef = {
        _type: 'image' as const,
        asset: {_type: 'reference' as const, _ref: asset._id},
      }

      uploadCache.set(wpMediaId, imageRef)
      return imageRef
    } catch (error) {
      console.error(`  Error uploading image ${sourceUrl}:`, error)
      return undefined
    }
  })
}

/**
 * Fetch the media details from WP API and upload to Sanity.
 */
export async function uploadWpMedia(
  wpMediaId: number,
  baseUrl: string,
): Promise<{_type: 'image'; asset: {_type: 'reference'; _ref: string}; alt?: string} | undefined> {
  if (!wpMediaId || wpMediaId === 0) return undefined

  try {
    const mediaResponse = await fetch(`${baseUrl}/media/${wpMediaId}`)
    if (!mediaResponse.ok) return undefined

    const media = await mediaResponse.json()
    const sourceUrl: string = media.source_url
    const altText: string = media.alt_text || ''

    const imageRef = await uploadImageFromUrl(sourceUrl, wpMediaId, media.title?.rendered)
    if (!imageRef) return undefined

    return {
      ...imageRef,
      ...(altText ? {alt: altText} : {}),
    }
  } catch (error) {
    console.error(`  Error fetching WP media ${wpMediaId}:`, error)
    return undefined
  }
}
