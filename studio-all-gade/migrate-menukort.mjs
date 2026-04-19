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
  console.log('Searching for menuPage document...')
  const pages = await client.fetch('*[_type == "menuPage"]')

  if (pages.length === 0) {
    console.error('Could not find any menuPage documents')
    return
  }

  const page = pages[0]
  console.log(`Found document with ID: ${page._id}`)

  const sections = []
  const generateKey = () => Math.random().toString(36).substring(2, 11)

  // 1. Hero
  sections.push({
    _type: 'menuHeroSection',
    _key: generateKey(),
    headerHeading: page.headerHeading,
    headerDescription: page.headerDescription,
    headerImage: page.headerImage,
    headerServingTimes: page.headerServingTimes,
    bookTableLabel: page.bookTableLabel,
    bookTableUrl: page.bookTableUrl,
  })

  // 2. Tabs
  sections.push({
    _type: 'menuTabsSection',
    _key: generateKey(),
    tabs: page.tabs,
  })

  // Append existing extra sections if any
  if (page.sections && Array.isArray(page.sections)) {
    page.sections.forEach(s => {
      const types = ['menuHeroSection', 'menuTabsSection']
      if (!types.includes(s._type)) {
        sections.push(s)
      }
    })
  }

  console.log(`Prepared ${sections.length} sections. Updating document...`)

  const unsetFields = [
    'headerHeading', 'headerDescription', 'headerImage', 'headerServingTimes', 'bookTableLabel', 'bookTableUrl', 'tabs'
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
