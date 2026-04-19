import {defineArrayMember, defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const eventsPageType = defineType({
  name: 'eventsPage',
  title: 'Begivenheder Side',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero-billede',
      type: 'image',
      description: 'Vises i højre side af hero-sektionen. Falder tilbage til det første kommende arrangements billede.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'sections',
      title: 'Side-sektioner',
      description: 'Byg begivenhedssiden ved at tilføje og reorder sektioner nedenfor.',
      type: 'array',
      of: [
        defineArrayMember({type: 'eventsHeroSection'}),
        defineArrayMember({type: 'eventsListSection'}),
        defineArrayMember({type: 'eventsArchiveSection'}),
        defineArrayMember({type: 'textImageSection'}),
        defineArrayMember({type: 'bannerSection'}),
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'gallerySection'}),
        defineArrayMember({type: 'quoteSection'}),
        defineArrayMember({type: 'ctaBannerSection'}),
      ],
      initialValue: [
        {_type: 'eventsHeroSection'},
        {_type: 'eventsListSection'},
        {_type: 'eventsArchiveSection'},
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Begivenheder Side'}),
  },
})
