import type {SanityDocumentLike} from 'sanity'
import {createOrReplace, defineMigration} from 'sanity/migrate'
import {decode} from 'html-entities'

import {BASE_URL, PER_PAGE} from './constants'
import {wpDataTypeFetch} from './lib/wpDataTypeFetch'
import {htmlToPortableText} from './lib/htmlToPortableText'
import {uploadWpMedia} from './lib/uploadImage'

// ── WP page classification by ID ──

const HOTEL_PARENT_ID = 2068
const VENUE_PAGE_IDS = new Set([2592, 2603, 3279]) // Gården, Salon, Kongesalen

// Pages to skip: containers, forms, password-protected, placeholders
const SKIP_PAGE_IDS = new Set([
  5, // Forside (front page — handled by frontend)
  28, // Om os (about — content will be re-entered or handled separately)
  30, // Kontakt (contact — handled by frontend form)
  1074, // Frokost (password-protected)
  1092, // Brunch (placeholder — "menu being updated")
  1171, // Restaurantmenu (password-protected)
  1196, // Vinkort (password-protected)
  2068, // Hotel (parent page, not publicly visible)
  2179, // Menukort (password-protected container)
  2222, // Selskaber (container page for venues)
  2384, // Selskabsmenuer (placeholder — "menu coming soon")
  2387, // Reception & Møde (password-protected)
  2389, // Julefrokoster (seasonal — password-protected)
  2393, // Påskebord (seasonal — password-protected)
  2455, // Aften (password-protected)
  2494, // Grill Buffet (password-protected)
  2506, // Teater Menu (placeholder — "menu being updated")
  2515, // Drikkevarer (password-protected)
  2557, // Restaurant (container)
  2811, // Mortens Aften (password-protected/old event)
  3364, // Events (listing container)
  3569, // Jobs (form page, handled by frontend)
])

// Posts that are actually events (identified by content analysis)
const EVENT_POST_IDS = new Set([3546]) // Jazz middag

function stripHtml(html: string): string {
  if (!html) return ''
  return decode(html.replace(/<[^>]*>/g, '')).trim()
}

function makeSlug(wpSlug: string): {_type: 'slug'; current: string} {
  return {_type: 'slug', current: wpSlug}
}

export default defineMigration({
  title: 'Import WP — full migration',

  async *migrate() {
    console.log('=== Starting full WordPress → Sanity migration ===')
    console.log(`Source: ${BASE_URL}`)

    // ── 1. Import posts ──
    console.log('\n── Importing posts ──')
    let page = 1
    let hasMore = true

    while (hasMore) {
      try {
        const wpPosts = await wpDataTypeFetch('posts', page)
        if (!Array.isArray(wpPosts) || wpPosts.length === 0) {
          hasMore = false
          break
        }

        for (const wpPost of wpPosts) {
          const isEvent = EVENT_POST_IDS.has(wpPost.id)
          const featuredImage = await uploadWpMedia(wpPost.featured_media, BASE_URL)
          const body = htmlToPortableText(wpPost.content?.rendered || '')

          if (isEvent) {
            const doc: SanityDocumentLike = {
              _id: `event-${wpPost.id}`,
              _type: 'event',
              title: stripHtml(wpPost.title?.rendered || ''),
              slug: makeSlug(wpPost.slug),
              startDate: wpPost.date || undefined,
              excerpt: stripHtml(wpPost.excerpt?.rendered || ''),
              body,
              ...(featuredImage ? {image: featuredImage} : {}),
              menu: [
                {
                  _type: 'menuCourse',
                  _key: 'starter',
                  course: 'Forret',
                  description: 'Klassisk rejecocktail',
                },
                {
                  _type: 'menuCourse',
                  _key: 'main',
                  course: 'Hovedret',
                  description:
                    'Helstegt oksefilet serveret med pomfritter, grøn salat og pebersauce',
                },
                {
                  _type: 'menuCourse',
                  _key: 'dessert',
                  course: 'Dessert',
                  description: 'Rabarbertrifli',
                },
              ],
            }
            console.log(`  Event: ${doc.title}`)
            yield createOrReplace(doc)
          } else {
            const doc: SanityDocumentLike = {
              _id: `post-${wpPost.id}`,
              _type: 'post',
              title: stripHtml(wpPost.title?.rendered || ''),
              slug: makeSlug(wpPost.slug),
              publishedAt: wpPost.date || undefined,
              excerpt: stripHtml(wpPost.excerpt?.rendered || ''),
              body,
              ...(featuredImage ? {image: featuredImage} : {}),
            }
            console.log(`  Post: ${doc.title}`)
            yield createOrReplace(doc)
          }
        }

        page++
        if (wpPosts.length < PER_PAGE) hasMore = false
      } catch (error) {
        console.error(`Error fetching posts page ${page}:`, error)
        hasMore = false
      }
    }

    // ── 2. Import pages → venues & hotel rooms ──
    console.log('\n── Importing pages ──')
    page = 1
    hasMore = true

    while (hasMore) {
      try {
        const wpPages = await wpDataTypeFetch('pages', page)
        if (!Array.isArray(wpPages) || wpPages.length === 0) {
          hasMore = false
          break
        }

        for (const wpPage of wpPages) {
          if (SKIP_PAGE_IDS.has(wpPage.id)) {
            console.log(`  Skipping: ${stripHtml(wpPage.title?.rendered || '')} (id: ${wpPage.id})`)
            continue
          }

          const featuredImage = await uploadWpMedia(wpPage.featured_media, BASE_URL)
          const body = htmlToPortableText(wpPage.content?.rendered || '')

          if (VENUE_PAGE_IDS.has(wpPage.id)) {
            const doc: SanityDocumentLike = {
              _id: `venue-${wpPage.id}`,
              _type: 'venue',
              title: stripHtml(wpPage.title?.rendered || ''),
              slug: makeSlug(wpPage.slug),
              description: extractVenueDescription(),
              body,
              ...(featuredImage ? {image: featuredImage} : {}),
            }
            console.log(`  Venue: ${doc.title}`)
            yield createOrReplace(doc)
          } else if (wpPage.parent === HOTEL_PARENT_ID) {
            const {roomType, pricePerNight} = classifyHotelRoom(wpPage)
            const doc: SanityDocumentLike = {
              _id: `hotelRoom-${wpPage.id}`,
              _type: 'hotelRoom',
              title: stripHtml(wpPage.title?.rendered || ''),
              slug: makeSlug(wpPage.slug.replace('hotel/', '')),
              roomType,
              pricePerNight,
              description: stripHtml(wpPage.excerpt?.rendered || ''),
              body,
              ...(featuredImage ? {image: featuredImage} : {}),
            }
            console.log(`  Hotel Room: ${doc.title} (${roomType}, ${pricePerNight} kr/nat)`)
            yield createOrReplace(doc)
          } else {
            console.log(
              `  Skipping unclassified page: ${stripHtml(wpPage.title?.rendered || '')} (id: ${wpPage.id})`,
            )
          }
        }

        page++
        if (wpPages.length < PER_PAGE) hasMore = false
      } catch (error) {
        console.error(`Error fetching pages page ${page}:`, error)
        hasMore = false
      }
    }

    // ── 3. Create site settings ──
    console.log('\n── Creating site settings ──')
    const siteSettings: SanityDocumentLike = {
      _id: 'siteSettings',
      _type: 'siteSettings',
      title: 'Allégade 10',
      address: 'Allégade 10\n2000 Frederiksberg',
      phone: '33 31 17 51',
      email: 'info@allegade10.dk',
      openingHours: 'Se hjemmesiden for aktuelle åbningstider',
      socialLinks: [
        {
          _type: 'socialLink',
          _key: 'instagram',
          platform: 'Instagram',
          url: 'https://www.instagram.com/allegade10/',
        },
        {
          _type: 'socialLink',
          _key: 'facebook',
          platform: 'Facebook',
          url: 'https://www.facebook.com/allegade10/',
        },
      ],
    }
    console.log('  Site Settings: Allégade 10')
    yield createOrReplace(siteSettings)

    console.log('\n=== Migration complete ===')
  },
})

// ── Helpers ──

function classifyHotelRoom(wpPage: any): {
  roomType: 'enkeltværelse' | 'dobbeltværelse' | '3-personers'
  pricePerNight: number
} {
  const title = stripHtml(wpPage.title?.rendered || '').toLowerCase()
  const content = (wpPage.content?.rendered || '').toLowerCase()
  const slug = (wpPage.slug || '').toLowerCase()

  if (title.includes('dobbelt') || slug.includes('dobbelt')) {
    // The 3-person double room is 1000kr, the regular is 850kr
    const is3Person = content.includes('1000') || content.includes('3 gæster')
    return {roomType: 'dobbeltværelse', pricePerNight: is3Person ? 1000 : 850}
  }
  if (title.includes('enkelt') || slug.includes('enkelt')) {
    return {roomType: 'enkeltværelse', pricePerNight: 650}
  }
  return {roomType: 'dobbeltværelse', pricePerNight: 850}
}

function extractVenueDescription(): string {
  return 'Kuvertpris pr. person: 1.095 kr. Inkluderer 7 timers arrangement, velkomstdrink, 3-retters menu, kaffe/te med dessert, øl, sodavand og husets hvid- og rødvin samt natmad.'
}
