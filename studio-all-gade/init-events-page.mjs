import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: 'b0bkhf04',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

async function init() {
  console.log('Checking for eventsPage document...')
  const existing = await client.fetch('*[_type == "eventsPage"][0]')

  if (existing) {
    console.log('eventsPage document already exists.')
    return
  }

  console.log('Creating eventsPage document...')
  const generateKey = () => Math.random().toString(36).substring(2, 11)

  const doc = {
    _type: 'eventsPage',
    _id: 'eventsPage',
    title: 'Begivenheder',
    sections: [
      {
        _type: 'eventsHeroSection',
        _key: generateKey(),
        heroEyebrow: 'Oplevelser',
        heroHeading: 'Begivenheder',
        heroHeadingItalic: 'på Allégade 10',
        heroDescription: 'Fra intime middage til festlige aftener — oplev Allégade 10\'s unikke begivenheder i historiske omgivelser på Frederiksberg.',
        heroCtaLabel: 'Se alle begivenheder'
      },
      {
        _type: 'eventsListSection',
        _key: generateKey(),
        upcomingHeading: 'Hvad sker der næste gang',
        emptyStateHeading: 'Ingen kommende begivenheder',
        emptyStateText: 'Følg med her — nye events annonceres løbende.',
        freeLabel: 'Gratis'
      },
      {
        _type: 'eventsArchiveSection',
        _key: generateKey(),
        archiveEyebrow: 'Arkiv',
        archiveHeading: 'Tidligere begivenheder'
      }
    ]
  }

  await client.createIfNotExists(doc)
  console.log('eventsPage document created successfully!')
}

init().catch(console.error)
