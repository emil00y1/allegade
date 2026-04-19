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
  console.log('Searching for eventsPage document...')
  const pages = await client.fetch('*[_type == "eventsPage"]')

  if (pages.length === 0) {
    console.error('Could not find any eventsPage documents')
    return
  }

  const page = pages[0]
  console.log(`Found document with ID: ${page._id}`)

  const sections = []
  const generateKey = () => Math.random().toString(36).substring(2, 11)

  // 1. Hero
  sections.push({
    _type: 'eventsHeroSection',
    _key: generateKey(),
    heroEyebrow: page.heroEyebrow,
    heroHeading: page.heroHeading,
    heroHeadingItalic: page.heroHeadingItalic,
    heroDescription: page.heroDescription,
    heroCtaLabel: page.heroCtaLabel,
  })

  // 2. List
  sections.push({
    _type: 'eventsListSection',
    _key: generateKey(),
    upcomingHeading: page.upcomingHeading,
    emptyStateHeading: page.emptyStateHeading,
    emptyStateText: page.emptyStateText,
    freeLabel: page.freeLabel,
  })

  // 3. Archive
  sections.push({
    _type: 'eventsArchiveSection',
    _key: generateKey(),
    archiveEyebrow: page.archiveEyebrow,
    archiveHeading: page.archiveHeading,
  })

  // Append existing extra sections if any
  if (page.sections && Array.isArray(page.sections)) {
    page.sections.forEach(s => {
      const types = ['eventsHeroSection', 'eventsListSection', 'eventsArchiveSection']
      if (!types.includes(s._type)) {
        sections.push(s)
      }
    })
  }

  console.log(`Prepared ${sections.length} sections. Updating document...`)

  const unsetFields = [
    'heroEyebrow', 'heroHeading', 'heroHeadingItalic', 'heroDescription', 'heroCtaLabel',
    'upcomingHeading', 'emptyStateHeading', 'emptyStateText', 'freeLabel',
    'archiveEyebrow', 'archiveHeading'
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
