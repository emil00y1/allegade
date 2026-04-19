import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: 'b0bkhf04',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

async function migrate() {
  console.log('Searching for selskaberPage document...')
  const pages = await client.fetch('*[_type == "selskaberPage"]')

  if (pages.length === 0) {
    console.error('Could not find any selskaberPage documents')
    return
  }

  const page = pages[0]
  console.log(`Found document with ID: ${page._id}`)

  const sections = []
  const generateKey = () => Math.random().toString(36).substring(2, 11)

  // 1. Hero
  sections.push({
    _type: 'selskaberHeroSection',
    _key: generateKey(),
    heroImage: page.heroImage,
    heroHeading: page.heroHeading,
    heroHeadingItalic: page.heroHeadingItalic,
    heroDescription: page.heroDescription,
    heroCtaLabel: page.heroCtaLabel,
    heroMenuCtaLabel: page.heroMenuCtaLabel,
    heroMenuCtaUrl: page.heroMenuCtaUrl,
  })

  // 2. Occasions
  sections.push({
    _type: 'selskaberOccasionsSection',
    _key: generateKey(),
    occasions: page.occasions,
  })

  // 3. Venues
  sections.push({
    _type: 'selskaberVenuesSection',
    _key: generateKey(),
    venueEyebrow: page.venueEyebrow,
    venueHeading: page.venueHeading,
    venueCtaLabel: page.venueCtaLabel,
    venues: page.venues,
  })

  // 4. Menu
  sections.push({
    _type: 'selskaberMenuSection',
    _key: generateKey(),
    menuEyebrow: page.menuEyebrow,
    menuHeading: page.menuHeading,
    menuDescription: page.menuDescription,
    menuPdfUrl: page.menuPdfUrl,
    menuPdfFallbackLabel: page.menuPdfFallbackLabel,
    menuCardFallbackLabel: page.menuCardFallbackLabel,
  })

  // 5. CTA Banner
  if (page.ctaBannerHeading || page.ctaBannerImage) {
    sections.push({
      _type: 'selskaberCtaBannerSection',
      _key: generateKey(),
      ctaBannerImage: page.ctaBannerImage,
      ctaBannerHeading: page.ctaBannerHeading,
      ctaBannerButtonLabel: page.ctaBannerButtonLabel,
    })
  }

  // 6. Form
  sections.push({
    _type: 'selskaberFormSection',
    _key: generateKey(),
    formHeading: page.formHeading,
    formDescription: page.formDescription,
    formPhone: page.formPhone,
    formEmail: page.formEmail,
  })

  // Append existing extra sections if any
  if (page.sections && Array.isArray(page.sections)) {
    page.sections.forEach(s => {
      const types = [
        'selskaberHeroSection', 'selskaberOccasionsSection', 'selskaberVenuesSection',
        'selskaberMenuSection', 'selskaberCtaBannerSection', 'selskaberFormSection'
      ]
      if (!types.includes(s._type)) {
        sections.push(s)
      }
    })
  }

  console.log(`Prepared ${sections.length} sections. Updating document...`)

  const unsetFields = [
    'heroImage', 'heroHeading', 'heroHeadingItalic', 'heroDescription', 'heroCtaLabel', 'heroMenuCtaLabel', 'heroMenuCtaUrl',
    'occasions', 'venueEyebrow', 'venueHeading', 'venueCtaLabel', 'venues',
    'menuEyebrow', 'menuHeading', 'menuDescription', 'menuPdfUrl', 'menuPdfFallbackLabel', 'menuCardFallbackLabel',
    'ctaBannerImage', 'ctaBannerHeading', 'ctaBannerButtonLabel',
    'formHeading', 'formDescription', 'formPhone', 'formEmail'
  ]

  await client
    .patch(page._id)
    .set({ sections })
    .unset(unsetFields)
    .commit()

  console.log('Migration completed successfully!')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
