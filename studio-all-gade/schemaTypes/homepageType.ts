import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const homepageType = defineType({
  name: 'homepage',
  type: 'document',
  title: 'Forside',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Sidetitel (intern)',
      type: 'string',
      initialValue: 'Forside',
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
      description: 'Byg forsiden ved at tilføje og reorder sektioner nedenfor. Du kan nu frit flytte rundt på Hero, Velkomst, Events og Selskaber sektionerne.',
      type: 'array',
      of: [
        defineArrayMember({type: 'homeHeroSection'}),
        defineArrayMember({type: 'welcomeSection'}),
        defineArrayMember({type: 'eventsTeaserSection'}),
        defineArrayMember({type: 'selskaberTeaserSection'}),
        defineArrayMember({type: 'textImageSection'}),
        defineArrayMember({type: 'bannerSection'}),
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'gallerySection'}),
        defineArrayMember({type: 'quoteSection'}),
        defineArrayMember({type: 'ctaBannerSection'}),
        defineArrayMember({type: 'faqSection'}),
        defineArrayMember({type: 'testimonialsSection'}),
        defineArrayMember({type: 'teamSection'}),
        defineArrayMember({type: 'offersSection'}),
        defineArrayMember({type: 'jobListingSection'}),
        defineArrayMember({type: 'reusableBlockReferenceSection'}),
      ],
      initialValue: [
        {_type: 'homeHeroSection'},
        {_type: 'welcomeSection'},
        {_type: 'eventsTeaserSection'},
        {_type: 'selskaberTeaserSection'},
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Forside'}
    },
  },
})
