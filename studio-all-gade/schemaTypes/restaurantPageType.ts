import {defineArrayMember, defineField, defineType} from 'sanity'
import {BillIcon} from '@sanity/icons'

export const restaurantPageType = defineType({
  name: 'restaurantPage',
  title: 'Restaurant Side',
  type: 'document',
  icon: BillIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Sidetitel (intern)',
      type: 'string',
      initialValue: 'Restaurant',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
    }),

    // ─── Page Builder Sections ────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Side-sektioner',
      description: 'Byg restaurantsiden ved at tilføje og reorder sektioner nedenfor.',
      type: 'array',
      of: [
        defineArrayMember({type: 'restaurantHeroSection'}),
        defineArrayMember({type: 'restaurantStorySection'}),
        defineArrayMember({type: 'restaurantMenuTeaserSection'}),
        defineArrayMember({type: 'restaurantPhilosophySection'}),
        defineArrayMember({type: 'textImageSection'}),
        defineArrayMember({type: 'bannerSection'}),
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'gallerySection'}),
        defineArrayMember({type: 'quoteSection'}),
        defineArrayMember({type: 'ctaBannerSection'}),
      ],
      initialValue: [
        {_type: 'restaurantHeroSection'},
        {_type: 'restaurantStorySection'},
        {_type: 'restaurantMenuTeaserSection'},
        {_type: 'restaurantPhilosophySection'},
        {_type: 'gallerySection'},
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Restaurant Side'}),
  },
})
