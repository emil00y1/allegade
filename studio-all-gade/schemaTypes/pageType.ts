import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const pageType = defineType({
  name: 'page',
  type: 'document',
  title: 'Side',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Sidetitel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-sti',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
    }),
    defineField({
      name: 'isPublished',
      title: 'Publiceret',
      description: 'Slå fra for at skjule siden fra besøgende',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'publishAt',
      title: 'Planlagt publicering',
      description:
        'Valgfrit. Hvis angivet, vises siden først for besøgende efter denne dato og tid.',
      type: 'datetime',
      hidden: ({document}) => document?.isPublished === false,
    }),
    defineField({
      name: 'sections',
      title: 'Side-sektioner',
      description: 'Byg siden ved at tilføje og sortere sektioner nedenfor.',
      type: 'array',
      of: [
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
        defineArrayMember({type: 'contactSection'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', isPublished: 'isPublished', publishAt: 'publishAt'},
    prepare({title, slug, isPublished, publishAt}) {
      const now = new Date()
      const isScheduled = isPublished !== false && publishAt && new Date(publishAt) > now
      let status = ''
      if (isPublished === false) status = ' (skjult)'
      else if (isScheduled) status = ' ⏳ Planlagt'
      return {
        title: title || 'Unavngivet side',
        subtitle: `/${slug || ''}${status}`,
      }
    },
  },
})
