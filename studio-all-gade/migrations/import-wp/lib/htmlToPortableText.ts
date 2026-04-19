import {htmlToBlocks} from '@portabletext/block-tools'
import {JSDOM} from 'jsdom'
import {Schema} from '@sanity/schema'
import {decode} from 'html-entities'
import {schemaTypes} from '../../../schemaTypes'

// Build a compiled schema so block-tools can resolve block types
const defaultSchema = Schema.compile({types: schemaTypes})
const blockContentType = defaultSchema
  .get('post')
  .fields.find((f: {name: string}) => f.name === 'body').type

/**
 * Convert WordPress HTML content to Sanity portable text blocks.
 * Strips Elementor shortcodes and empty markup before converting.
 */
export function htmlToPortableText(html: string) {
  if (!html || !html.trim()) return []

  // Decode HTML entities
  let cleaned = decode(html)

  // Strip Elementor/WP shortcodes like [shortcode attr="val"]...[/shortcode]
  cleaned = cleaned.replace(/\[\/?\w[^\]]*\]/g, '')

  // Remove empty paragraphs
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '')

  // Remove data-* attributes and Elementor class noise (keeps the tags)
  cleaned = cleaned.replace(/\s+data-[\w-]+="[^"]*"/g, '')
  cleaned = cleaned.replace(/\s+class="elementor[^"]*"/g, '')

  if (!cleaned.trim()) return []

  const {document} = new JSDOM(`<!DOCTYPE html><body>${cleaned}</body>`).window

  return htmlToBlocks(document.body.innerHTML, blockContentType, {
    parseHtml: (htmlStr: string) => new JSDOM(htmlStr).window.document,
  })
}
