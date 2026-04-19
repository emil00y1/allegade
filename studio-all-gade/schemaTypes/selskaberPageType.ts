import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const selskaberPageType = defineType({
  name: 'selskaberPage',
  title: 'Selskaber Side',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'hero', title: '1. Hero'},
    {name: 'occasions', title: '2. Anledninger'},
    {name: 'venues', title: '3. Lokaler'},
    {name: 'menu', title: '4. Selskabsmenuer'},
    {name: 'cta', title: '5. CTA Banner'},
    {name: 'form', title: '6. Kontaktformular'},
    {name: 'sections', title: '7. Ekstra sektioner'},
    {name: 'seo', title: 'SEO & Social'},
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'breadcrumbLabel',
      title: 'Brødkrumme Label',
      type: 'string',
      initialValue: 'Selskaber',
      group: 'hero',
    }),

    // ─── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero billede (højre side)',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Overskrift linje 1',
      type: 'string',
      initialValue: 'Fejr jeres næste',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadingItalic',
      title: 'Overskrift kursiv (2. linje)',
      type: 'string',
      initialValue: 'begivenhed hos os',
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
      initialValue:
        'Siden 1780 har Allégade 10 dannet rammen om livets store øjeblikke. Fra intime middage til de helt store fester.',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Primær CTA tekst',
      type: 'string',
      initialValue: 'Send en forespørgsel',
      group: 'hero',
    }),
    defineField({
      name: 'heroMenuCtaLabel',
      title: 'Sekundær CTA tekst',
      type: 'string',
      initialValue: 'Se selskabsmenuer',
      group: 'hero',
    }),
    defineField({
      name: 'heroMenuCtaUrl',
      title: 'Sekundær CTA link',
      type: 'string',
      description: 'F.eks. link til PDF eller menukortsiden',
      group: 'hero',
    }),

    // ─── Occasions ────────────────────────────────────────────────────────────
    defineField({
      name: 'occasions',
      title: 'Anledninger (faner)',
      type: 'array',
      group: 'occasions',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Fane label (f.eks. Bryllup)', type: 'string'}),
            defineField({name: 'heading', title: 'Overskrift', type: 'string'}),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 3}),
            defineField({
              name: 'capacity',
              title: 'Kapacitet (f.eks. Op til 120 gæster)',
              type: 'string',
            }),
            defineField({
              name: 'facilities',
              title: 'Faciliteter (f.eks. Egen bar & terrasse)',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Billede',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt tekst'})],
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'heading'}},
        }),
      ],
    }),

    // ─── Venues ───────────────────────────────────────────────────────────────
    defineField({
      name: 'venueEyebrow',
      title: 'Lokalersektion øjenbryn (kursiv)',
      type: 'string',
      initialValue: 'De Historiske Lokaler',
      group: 'venues',
    }),
    defineField({
      name: 'venueHeading',
      title: 'Lokalersektion overskrift',
      type: 'string',
      initialValue: 'Vores Selskabslokaler',
      group: 'venues',
    }),
    defineField({
      name: 'venueCtaLabel',
      title: 'Lokale CTA Tekst (forespørg knap)',
      type: 'string',
      initialValue: 'Forespørg om lokalet',
      group: 'venues',
    }),
    defineField({
      name: 'venues',
      title: 'Lokaler',
      type: 'array',
      group: 'venues',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Lokalets navn', type: 'string'}),
            defineField({
              name: 'capacity',
              title: 'Kapacitet (f.eks. Op til 80 gæster)',
              type: 'string',
            }),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 3}),
            defineField({
              name: 'image',
              title: 'Billede',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt tekst'})],
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'capacity'}},
        }),
      ],
    }),

    // ─── Menu section ─────────────────────────────────────────────────────────
    defineField({
      name: 'menuEyebrow',
      title: 'Menusektionens øjenbryn (kursiv)',
      type: 'string',
      initialValue: 'Vores Selskabsmenuer',
      group: 'menu',
    }),
    defineField({
      name: 'menuHeading',
      title: 'Menusektionens overskrift',
      type: 'string',
      initialValue: 'Gastronomi skabt til fællesskab',
      group: 'menu',
    }),
    defineField({
      name: 'menuDescription',
      title: 'Menusektionens beskrivelse',
      type: 'text',
      rows: 2,
      initialValue:
        'Vores køkkenchef har sammensat en række menuer, der hylder det klassiske danske køkken med et moderne twist. Vi fokuserer på de bedste råvarer i sæson.',
      group: 'menu',
    }),
    defineField({
      name: 'menuPdfUrl',
      title: 'Selskabsmenu PDF link',
      type: 'string',
      group: 'menu',
    }),
    defineField({
      name: 'menuPdfFallbackLabel',
      title: 'PDF Knap Tekst (når PDF link er sat)',
      type: 'string',
      initialValue: 'Se selskabsmenuer (PDF)',
      group: 'menu',
    }),
    defineField({
      name: 'menuCardFallbackLabel',
      title: 'Menukort Knap Tekst (når intet PDF link)',
      type: 'string',
      initialValue: 'Se vores menukort',
      group: 'menu',
    }),

    // ─── CTA Banner ───────────────────────────────────────────────────────────
    defineField({
      name: 'ctaBannerImage',
      title: 'CTA Banner billede',
      type: 'image',
      options: {hotspot: true},
      group: 'cta',
    }),
    defineField({
      name: 'ctaBannerHeading',
      title: 'CTA Banner overskrift',
      type: 'string',
      initialValue: 'Hold Dit Selskab Hos Os',
      group: 'cta',
    }),
    defineField({
      name: 'ctaBannerButtonLabel',
      title: 'CTA Banner knapptekst',
      type: 'string',
      initialValue: 'Kontakt os',
      group: 'cta',
    }),

    // ─── Form ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'formHeading',
      title: 'Formularens overskrift',
      type: 'string',
      initialValue: 'Send en forespørgsel',
      group: 'form',
    }),
    defineField({
      name: 'formDescription',
      title: 'Formularens beskrivelse',
      type: 'text',
      rows: 3,
      initialValue:
        'Fortæl os lidt om jeres planer, så vender vi tilbage med et uforpligtende forslag til jeres arrangement.',
      group: 'form',
    }),
    defineField({
      name: 'formPhone',
      title: 'Kontakttelefon',
      type: 'string',
      initialValue: '+45 33 31 17 51',
      group: 'form',
    }),
    defineField({
      name: 'formEmail',
      title: 'Kontakt email',
      type: 'string',
      initialValue: 'info@allegade10.dk',
      group: 'form',
    }),
    defineField({
      name: 'formNotificationEmail',
      title: 'Notifikations email',
      description: 'Denne adresse modtager en kopi af nye forespørgsler (kræver SMTP-opsætning).',
      type: 'string',
      group: 'form',
    }),
    // ─── Page Builder Sections ────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Side-sektioner',
      description: 'Byg selskabssiden ved at tilføje og reorder sektioner nedenfor.',
      type: 'array',
      of: [
        defineArrayMember({type: 'selskaberHeroSection'}),
        defineArrayMember({type: 'selskaberOccasionsSection'}),
        defineArrayMember({type: 'selskaberVenuesSection'}),
        defineArrayMember({type: 'selskaberMenuSection'}),
        defineArrayMember({type: 'selskaberCtaBannerSection'}),
        defineArrayMember({type: 'selskaberFormSection'}),
        defineArrayMember({type: 'textImageSection'}),
        defineArrayMember({type: 'bannerSection'}),
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'gallerySection'}),
        defineArrayMember({type: 'quoteSection'}),
        defineArrayMember({type: 'ctaBannerSection'}),
      ],
      initialValue: [
        {_type: 'selskaberHeroSection'},
        {_type: 'selskaberOccasionsSection'},
        {_type: 'selskaberVenuesSection'},
        {_type: 'selskaberMenuSection'},
        {_type: 'selskaberCtaBannerSection'},
        {_type: 'selskaberFormSection'},
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Selskaber Side'}),
  },
})
