import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const selskaberPageType = defineType({
  name: 'selskaberPage',
  title: 'Selskaber Side',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'sections', title: '1. Sektioner'},
    {name: 'seo', title: 'SEO & Social'},
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      group: 'seo',
    }),

    // ─── Page Builder Sections ────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Side-sektioner',
      description: 'Byg selskabssiden ved at tilføje og reorder sektioner nedenfor.',
      type: 'array',
      group: 'sections',
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
