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
  _id: 'page-om-os',
  _type: 'page',
  title: 'Om Os',
  slug: {_type: 'slug', current: 'om-os'},
  isPublished: true,
  sections: [
    {
      _type: 'richTextSection',
      _key: randomKey(12),
      heading: 'En institution siden 1797',
      eyebrow: 'Vores historie',
      alignment: 'left',
      maxWidth: 'narrow',
      backgroundColor: 'white',
      body: [
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: randomKey(12),
              text: 'Allégade 10 er en af Frederiksbergs ældste og mest elskede institutioner. Siden 1797 har vi budt gæster velkomne med god mad, varme omgivelser og en ægte fornemmelse af sted.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: randomKey(12),
              text: 'Gennem generationer har stedet udviklet sig — fra kro til restaurant og hotel — men kernen er forblevet den samme: et oprigtigt ønske om at give gæsterne en oplevelse, der sidder fast.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
    },
    {
      _type: 'richTextSection',
      _key: randomKey(12),
      heading: 'Vores værdier',
      eyebrow: 'Hvad vi tror på',
      alignment: 'left',
      maxWidth: 'narrow',
      backgroundColor: 'beige',
      body: [
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: randomKey(12),
              text: 'Vi tror på kvalitet frem for kvantitet, på sæsonens råvarer og på håndværket bag et godt måltid. Vi tror på, at gæstfrihed ikke er en ydelse — det er en holdning.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
    },
    {
      _type: 'gallerySection',
      _key: randomKey(12),
      heading: 'Stedet',
      columns: '3',
      aspectRatio: 'landscape',
      images: [],
    },
  ],
}

async function seed() {
  const existing = await client.getDocument(doc._id)

  if (existing) {
    console.log('Om Os page already exists. Skipping.')
    return
  }

  await client.create(doc)
  console.log('Created Om Os page → /om-os')
}

seed().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
