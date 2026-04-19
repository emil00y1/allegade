import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: 'b0bkhf04',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

async function debug() {
  const docs = await client.fetch('*[(_type match "event*" || _id match "*event*") && !(_type == "event")] { _id, _type }')
  console.log('Found docs:', JSON.stringify(docs, null, 2))
}

debug().catch(console.error)
