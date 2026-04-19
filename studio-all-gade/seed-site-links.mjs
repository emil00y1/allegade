import {createClient} from '@sanity/client'
import 'dotenv/config'
import {randomKey} from '@sanity/util/content'

const client = createClient({
  projectId: 'b0bkhf04',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

const NAV_LINKS = [
  {_type: 'navLink', _key: randomKey(12), name: 'Restaurant', href: '/restaurant'},
  {_type: 'navLink', _key: randomKey(12), name: 'Hotel', href: '/hotel'},
  {_type: 'navLink', _key: randomKey(12), name: 'Menukort', href: '/menukort'},
  {_type: 'navLink', _key: randomKey(12), name: 'Selskaber', href: '/selskaber'},
  {_type: 'navLink', _key: randomKey(12), name: 'Events', href: '/begivenheder'},
  {_type: 'navLink', _key: randomKey(12), name: 'Om Os', href: '/om-os'},
]

const FOOTER_LINKS = [
  {_key: randomKey(12), label: 'Kontakt', url: '/kontakt'},
  {_key: randomKey(12), label: 'Karriere', url: '/karriere'},
  {_key: randomKey(12), label: 'Privatlivspolitik', url: '/privatlivspolitik'},
]

async function seed() {
  const existing = await client.getDocument('siteSettings')

  if (!existing) {
    console.error('siteSettings document not found. Run seed-singletons.mjs first.')
    process.exit(1)
  }

  await client.patch('siteSettings').set({
    navigation: NAV_LINKS,
    footerLinks: FOOTER_LINKS,
  }).commit()

  console.log('Done. Navigation and footer links updated.')
}

seed().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
