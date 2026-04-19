import {defineArrayMember, defineField, defineType} from 'sanity'
import {CopyIcon} from '@sanity/icons'

export const reusableBlockType = defineType({
  name: 'reusableBlock',
  type: 'document',
  title: 'Genanvendelig blok',
  icon: CopyIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel (intern)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'identifier',
      title: 'Identifikator',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Indhold',
      description: 'Sektionerne i denne blok kan genbruges på flere sider.',
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
      ],
    }),
  ],
  preview: {
    select: {title: 'title', content: 'content'},
    prepare({title, content}) {
      return {
        title: title || 'Unavngivet blok',
        subtitle: content?.length
          ? `${content.length} sektion${content.length === 1 ? '' : 'er'}`
          : 'Tom blok',
      }
    },
  },
})
