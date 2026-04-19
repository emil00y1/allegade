import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: 'b0bkhf04',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

async function cleanup() {
  console.log('Searching for menuPage document...')
  const pages = await client.fetch('*[_type == "menuPage"]')

  if (pages.length === 0) {
    console.error('No menuPage documents found')
    return
  }

  const page = pages[0]
  console.log(`Found document with ID: ${page._id}`)

  const staleFields = [
    'headerHeading',
    'headerDescription',
    'headerImage',
    'headerServingTimes',
    'bookTableLabel',
    'bookTableUrl',
    'tabs',
  ]

  const presentFields = staleFields.filter((f) => page[f] !== undefined)

  if (presentFields.length === 0) {
    console.log('No stale fields found — nothing to do.')
    return
  }

  console.log(`Removing stale fields: ${presentFields.join(', ')}`)

  await client.patch(page._id).unset(presentFields).commit()

  console.log('Done! Stale fields removed.')
}

cleanup().catch((err) => {
  console.error('Cleanup failed:', err)
  process.exit(1)
})
