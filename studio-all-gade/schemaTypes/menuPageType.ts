import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const menuPageType = defineType({
  name: 'menuPage',
  title: 'Menukort Side',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel (intern)',
      type: 'string',
      initialValue: 'Menukort',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
    }),
    defineField({
      name: 'breadcrumbLabel',
      title: 'Brødkrumme Label',
      type: 'string',
      initialValue: 'Menukort',
    }),
    defineField({
      name: 'sections',
      title: 'Side-sektioner',
      description: 'Byg menukort-siden ved at tilføje og reorder sektioner nedenfor.',
      type: 'array',
      of: [
        defineArrayMember({type: 'menuHeroSection'}),
        defineArrayMember({type: 'menuTabsSection'}),
        defineArrayMember({type: 'textImageSection'}),
        defineArrayMember({type: 'bannerSection'}),
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'gallerySection'}),
        defineArrayMember({type: 'quoteSection'}),
        defineArrayMember({type: 'ctaBannerSection'}),
      ],
      initialValue: [
        {_type: 'menuHeroSection'},
        {_type: 'menuTabsSection'},
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Menukort Side'}),
  },
})