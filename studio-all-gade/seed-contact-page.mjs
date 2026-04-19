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

const doc = {
  _id: 'page-kontakt',
  _type: 'page',
  title: 'Kontakt',
  slug: {_type: 'slug', current: 'kontakt'},
  isPublished: true,
  sections: [
    {
      _type: 'richTextSection',
      _key: randomKey(12),
      heading: 'Find os',
      eyebrow: 'Kontakt',
      alignment: 'left',
      maxWidth: 'narrow',
      backgroundColor: 'white',
      body: [
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Allégade 10', marks: ['strong']},
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Allégade 10\n2000 Frederiksberg', marks: []},
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Tlf: +45 33 31 17 97', marks: []},
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Email: info@allegade10.dk', marks: []},
          ],
          markDefs: [],
        },
      ],
    },
    {
      _type: 'richTextSection',
      _key: randomKey(12),
      heading: 'Åbningstider',
      eyebrow: 'Restaurant',
      alignment: 'left',
      maxWidth: 'narrow',
      backgroundColor: 'beige',
      body: [
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Mandag – Fredag: 11.00 – 22.00', marks: []},
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Lørdag: 10.00 – 22.00', marks: []},
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Søndag: 10.00 – 21.00', marks: []},
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Køkkenet lukker 20:30', marks: ['em']},
          ],
          markDefs: [],
        },
      ],
    },
  ],
}

async function seed() {
  const existing = await client.getDocument(doc._id)

  if (existing) {
    console.log('Kontakt page already exists. Skipping.')
    return
  }

  await client.create(doc)
  console.log('Created Kontakt page → /kontakt')
}

seed().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
