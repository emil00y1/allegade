import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const hotelPageType = defineType({
  name: 'hotelPage',
  title: 'Hotel Side',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: '1. Hero'},
    {name: 'facilities', title: '2. Faciliteter'},
    {name: 'rooms', title: '3. Værelses Showcase'},
    {name: 'practical', title: '4. Praktisk Info'},
    {name: 'neighborhood', title: '5. Nabolaget'},
    {name: 'restaurant', title: '6. Restaurant'},
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

    // ── HERO ─────────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Billede (højre side)',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Overskrift (normal del)',
      type: 'string',
      initialValue: 'Overnat i hjertet af',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadingItalic',
      title: 'Hero Overskrift (kursiv del)',
      type: 'string',
      initialValue: 'Frederiksberg',
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Beskrivelse',
      type: 'text',
      rows: 4,
      initialValue:
        "Oplev atmosfæren i en af Københavns ældste bygninger. Vores hotel kombinerer 1780'ernes historiske charme med moderne komfort i en af byens mest eksklusive bydele.",
      group: 'hero',
    }),
    defineField({
      name: 'heroStats',
      title: 'Hero Statistikker (kapacitet, pris, check-ud m.m.)',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Værdi', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Primær Knap Tekst',
      type: 'string',
      initialValue: 'Book ophold',
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaUrl',
      title: 'Primær Knap Link',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Sekundær Knap Tekst',
      type: 'string',
      initialValue: 'Se værelser',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaUrl',
      title: 'Sekundær Knap Link',
      type: 'string',
      initialValue: '#vaerelser',
      group: 'hero',
    }),
    defineField({
      name: 'heroFloatingStarText',
      title: 'Flydende Kort — Stor Tekst',
      type: 'string',
      initialValue: '★ 12 unikke værelser',
      group: 'hero',
    }),
    defineField({
      name: 'heroFloatingSubtext',
      title: 'Flydende Kort — Lille Tekst',
      type: 'string',
      initialValue: 'Hvert værelse har sin egen sjæl',
      group: 'hero',
    }),

    // ── BOOKING STRIP ────────────────────────────────────────────────────
    defineField({
      name: 'bookingCtaLabel',
      title: 'Booking Knap Tekst',
      type: 'string',
      initialValue: 'Søg ledige værelser',
      group: 'hero',
    }),
    defineField({
      name: 'bookingCtaUrl',
      title: 'Booking Knap Link',
      type: 'string',
      description: 'Link til bookingsystemet (SuitcaseBooking).',
      initialValue: 'https://allegade10.suitcasebooking.com/da',
      group: 'hero',
    }),

    // ── FACILITIES ───────────────────────────────────────────────────────
    defineField({
      name: 'facilitiesHeading',
      title: 'Faciliteter Overskrift (normal)',
      type: 'string',
      initialValue: 'Faciliteter',
      group: 'facilities',
    }),
    defineField({
      name: 'facilitiesHeadingItalic',
      title: 'Faciliteter Overskrift (kursiv)',
      type: 'string',
      initialValue: '& Bekvemmeligheder',
      group: 'facilities',
    }),
    defineField({
      name: 'facilitiesDescription',
      title: 'Faciliteter Beskrivelse',
      type: 'text',
      rows: 2,
      initialValue:
        'Historisk atmosfære betyder ikke mangel på komfort. Vi har sørget for alt det essentielle.',
      group: 'facilities',
    }),
    defineField({
      name: 'facilities',
      title: 'Faciliteter Liste',
      type: 'array',
      group: 'facilities',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'iconName',
              title: 'Ikon (Lucide)',
              type: 'lucide-icon',
            }),
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),

    // ── ROOM SHOWCASE ────────────────────────────────────────────────────
    defineField({
      name: 'roomShowcaseHeading',
      title: 'Værelse Overskrift',
      type: 'string',
      initialValue: 'Udforsk vores værelser',
      group: 'rooms',
    }),
    // ── PRACTICAL INFO / FAQ ─────────────────────────────────────────────
    defineField({
      name: 'practicalInfoHeading',
      title: 'Praktisk Info Overskrift (normal)',
      type: 'string',
      initialValue: 'Godt at',
      group: 'practical',
    }),
    defineField({
      name: 'practicalInfoHeadingItalic',
      title: 'Praktisk Info Overskrift (kursiv)',
      type: 'string',
      initialValue: 'Vide',
      group: 'practical',
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ / Accordions',
      type: 'array',
      group: 'practical',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Spørgsmål / Overskrift', type: 'string'}),
            defineField({name: 'answer', title: 'Svar / Indhold', type: 'text', rows: 4}),
          ],
          preview: {select: {title: 'question'}},
        }),
      ],
    }),

    // ── NEIGHBORHOOD ─────────────────────────────────────────────────────
    defineField({
      name: 'neighborhoodHeading',
      title: 'Nabolaget Overskrift (normal)',
      type: 'string',
      initialValue: 'Nabolaget',
      group: 'neighborhood',
    }),
    defineField({
      name: 'neighborhoodHeadingItalic',
      title: 'Nabolaget Overskrift (kursiv)',
      type: 'string',
      initialValue: 'Højdepunkter',
      group: 'neighborhood',
    }),
    defineField({
      name: 'neighborhoodAddress',
      title: 'Adresse (kort)',
      type: 'string',
      initialValue: 'Find os på Allégade 10',
      group: 'neighborhood',
    }),
    defineField({
      name: 'neighborhoodCity',
      title: 'By / Post',
      type: 'string',
      initialValue: '2000 Frederiksberg, Danmark',
      group: 'neighborhood',
    }),
    defineField({
      name: 'neighborhoodMapUrl',
      title: 'Google Maps Embed URL',
      type: 'url',
      description: 'Indsæt embed URL fra Google Maps (Share → Embed a map → kopier src-linket).',
      initialValue:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2250.3!2d12.52!3d55.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4652530c8d8d6e9b%3A0x7a5b7a5a5b7a5b7a!2sAll%C3%A9gade%2010%2C%202000%20Frederiksberg!5e0!3m2!1sda!2sdk!4v1234567890',
      group: 'neighborhood',
    }),
    defineField({
      name: 'mapEyebrow',
      title: 'Kort — Øjenbryn (lille tekst over adresse)',
      type: 'string',
      initialValue: 'Beliggenhed',
      group: 'neighborhood',
    }),
    defineField({
      name: 'directionsLabel',
      title: 'Vejledning Knap Tekst',
      type: 'string',
      initialValue: 'Få vejledning',
      group: 'neighborhood',
    }),
    defineField({
      name: 'neighborhoodItems',
      title: 'Nabolags Highlights',
      type: 'array',
      group: 'neighborhood',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            defineField({
              name: 'walkTime',
              title: 'Gangtid (f.eks. "2 min. gang")',
              type: 'string',
            }),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'title', subtitle: 'walkTime'}},
        }),
      ],
    }),

    // ── RESTAURANT CROSS-SELL ────────────────────────────────────────────
    defineField({
      name: 'restaurantEyebrow',
      title: 'Restaurant Eyebrow Tekst',
      type: 'string',
      initialValue: 'Gastronomi',
      group: 'restaurant',
    }),
    defineField({
      name: 'restaurantHeading',
      title: 'Restaurant Overskrift (normal del)',
      type: 'string',
      initialValue: 'Din overnatning er tæt på Frederiksbergs',
      group: 'restaurant',
    }),
    defineField({
      name: 'restaurantHeadingItalic',
      title: 'Restaurant Overskrift (kursiv del)',
      type: 'string',
      initialValue: 'ældste restaurant',
      group: 'restaurant',
    }),
    defineField({
      name: 'restaurantDescription',
      title: 'Restaurant Beskrivelse',
      type: 'text',
      rows: 3,
      initialValue:
        'Gør dit ophold komplet med en middag i vores historiske stuer. Som hotelgæst anbefaler vi at reservere bord i forvejen til en klassisk dansk frokost eller aftenmenu.',
      group: 'restaurant',
    }),
    defineField({
      name: 'restaurantCtaLabel',
      title: 'Restaurant CTA Tekst',
      type: 'string',
      initialValue: 'Udforsk Restauranten',
      group: 'restaurant',
    }),
    defineField({
      name: 'restaurantCtaUrl',
      title: 'Restaurant CTA Link',
      type: 'string',
      group: 'restaurant',
    }),
    defineField({
      name: 'restaurantImage',
      title: 'Restaurant Billede',
      type: 'image',
      options: {hotspot: true},
      group: 'restaurant',
    }),

    // ─── Page Builder Sections ────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Side-sektioner',
      description: 'Byg hotelsiden ved at tilføje og reorder sektioner nedenfor.',
      type: 'array',
      of: [
        defineArrayMember({type: 'hotelHeroSection'}),
        defineArrayMember({type: 'hotelFacilitiesSection'}),
        defineArrayMember({type: 'hotelRoomShowcaseSection'}),
        defineArrayMember({type: 'hotelPracticalInfoSection'}),
        defineArrayMember({type: 'hotelNeighborhoodSection'}),
        defineArrayMember({type: 'hotelRestaurantTeaserSection'}),
        defineArrayMember({type: 'hotelStorySection'}),
        defineArrayMember({type: 'hotelArrivalSection'}),
        defineArrayMember({type: 'textImageSection'}),
        defineArrayMember({type: 'bannerSection'}),
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'gallerySection'}),
        defineArrayMember({type: 'quoteSection'}),
        defineArrayMember({type: 'ctaBannerSection'}),
      ],
      initialValue: [
        {_type: 'hotelHeroSection'},
        {_type: 'hotelFacilitiesSection'},
        {_type: 'hotelRoomShowcaseSection'},
        {_type: 'hotelPracticalInfoSection'},
        {_type: 'hotelNeighborhoodSection'},
        {_type: 'hotelRestaurantTeaserSection'},
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Hotel Side'}),
  },
})
