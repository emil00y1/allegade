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
  console.log('Fetching homepage document...')
  const homepage = await client.getDocument('homepage')

  if (!homepage) {
    console.error('Could not find homepage document')
    return
  }

  const sections = []

  const generateKey = () => Math.random().toString(36).substring(2, 11)

  // Migrate Hero
  if (homepage.hero) {
    console.log('Migrating Hero section...')
    sections.push({
      _type: 'homeHeroSection',
      _key: generateKey(),
      ...homepage.hero
    })
  }

  // Migrate Welcome
  if (homepage.welcomeSection) {
    console.log('Migrating Welcome section...')
    sections.push({
      _type: 'welcomeSection',
      _key: generateKey(),
      ...homepage.welcomeSection
    })
  }

  // Migrate Events
  if (homepage.eventsSection) {
    console.log('Migrating Events teaser...')
    sections.push({
      _type: 'eventsTeaserSection',
      _key: generateKey(),
      ...homepage.eventsSection
    })
  }

  // Migrate Selskaber
  if (homepage.selskaberTeaser) {
    console.log('Migrating Selskaber teaser...')
    sections.push({
      _type: 'selskaberTeaserSection',
      _key: generateKey(),
      ...homepage.selskaberTeaser
    })
  }

  // Append existing extra sections if any
  if (homepage.sections && Array.isArray(homepage.sections)) {
    console.log('Preserving existing extra sections...')
    homepage.sections.forEach(s => {
      // Don't duplicate if already migrated (simple check)
      if (!['homeHeroSection', 'welcomeSection', 'eventsTeaserSection', 'selskaberTeaserSection'].includes(s._type)) {
        sections.push(s)
      }
    })
  }

  console.log(`Prepared ${sections.length} sections. Updating document...`)

  await client
    .patch('homepage')
    .set({ sections })
    .unset(['hero', 'welcomeSection', 'eventsSection', 'selskaberTeaser'])
    .commit()

  console.log('Migration completed successfully!')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
