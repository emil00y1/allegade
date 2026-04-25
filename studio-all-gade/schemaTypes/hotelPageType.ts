import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const hotelPageType = defineType({
  name: 'hotelPage',
  title: 'Hotel Side',
  type: 'document',
  icon: HomeIcon,
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
      description: 'Byg hotelsiden ved at tilføje og reorder sektioner nedenfor.',
      type: 'array',
      group: 'sections',
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
