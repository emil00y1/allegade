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
  _id: 'page-privatlivspolitik',
  _type: 'page',
  title: 'Privatlivspolitik',
  slug: {_type: 'slug', current: 'privatlivspolitik'},
  isPublished: true,
  sections: [
    {
      _type: 'richTextSection',
      _key: randomKey(12),
      heading: 'Privatlivspolitik',
      eyebrow: 'Juridisk',
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
              text: 'Hos Allégade 10 respekterer vi dit privatliv og behandler dine personoplysninger med omhu. Denne privatlivspolitik beskriver, hvilke oplysninger vi indsamler, hvordan vi bruger dem, og hvilke rettigheder du har.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'h2',
          children: [{_type: 'span', _key: randomKey(12), text: 'Dataansvarlig', marks: []}],
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
              text: 'Allégade 10\nAllégade 10\n2000 Frederiksberg\ninfo@allegade10.dk',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'h2',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Hvilke oplysninger indsamler vi?', marks: []},
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
              text: 'Vi indsamler kun personoplysninger, når du aktivt giver dem til os — for eksempel når du tilmelder dig vores nyhedsbrev, sender en forespørgsel om selskaber eller søger en stilling hos os. Det kan dreje sig om:',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          listItem: 'bullet',
          level: 1,
          children: [{_type: 'span', _key: randomKey(12), text: 'Navn og e-mailadresse (nyhedsbrev)', marks: []}],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          listItem: 'bullet',
          level: 1,
          children: [
            {
              _type: 'span',
              _key: randomKey(12),
              text: 'Kontaktoplysninger og eventdetaljer (selskabsforespørgsler)',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'normal',
          listItem: 'bullet',
          level: 1,
          children: [
            {
              _type: 'span',
              _key: randomKey(12),
              text: 'CV og ansøgning (jobansøgninger)',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'h2',
          children: [
            {_type: 'span', _key: randomKey(12), text: 'Hvordan bruger vi dine oplysninger?', marks: []},
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
              text: 'Vi bruger dine oplysninger udelukkende til det formål, du har givet dem til os: at sende dig vores nyhedsbrev, besvare din forespørgsel eller behandle din jobansøgning. Vi sælger eller deler ikke dine oplysninger med tredjepart til markedsføringsformål.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'h2',
          children: [{_type: 'span', _key: randomKey(12), text: 'Cookies', marks: []}],
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
              text: 'Vores hjemmeside benytter ikke sporings- eller markedsføringscookies. Vi anvender ingen tredjeparts analyse- eller annonceringsværktøjer.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'h2',
          children: [{_type: 'span', _key: randomKey(12), text: 'Dine rettigheder', marks: []}],
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
              text: 'Du har til enhver tid ret til at få indsigt i, berigtige eller slette de personoplysninger, vi har registreret om dig. Du kan også trække dit samtykke tilbage — for eksempel ved at afmelde nyhedsbrevet via linket i bunden af hver e-mail. Kontakt os på info@allegade10.dk for at udøve dine rettigheder.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: randomKey(12),
          style: 'h2',
          children: [{_type: 'span', _key: randomKey(12), text: 'Kontakt', marks: []}],
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
              text: 'Har du spørgsmål til vores behandling af personoplysninger, er du velkommen til at kontakte os på info@allegade10.dk. Du kan også klage til Datatilsynet på datatilsynet.dk.',
              marks: [],
            },
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
    console.log('Privatlivspolitik page already exists. Skipping.')
    return
  }

  await client.create(doc)
  console.log('Created privatlivspolitik page → /privatlivspolitik')
}

seed().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
