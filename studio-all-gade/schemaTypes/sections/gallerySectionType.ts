import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'
import {BulkImageArrayInput} from '../../components/BulkImageArrayInput'

export const gallerySectionType = defineType({
  name: 'gallerySection',
  type: 'object',
  title: 'Galleri',
  icon: ImagesIcon,
  description: 'Billedgalleri i et gitter — vælg antal kolonner og billedformat.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Billeder',
      type: 'array',
      components: {input: BulkImageArrayInput},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt tekst', type: 'string'}),
            defineField({name: 'caption', title: 'Billedtekst', type: 'string'}),
          ],
        }),
      ],
      validation: (r) => r.min(1).max(8),
    }),
    defineField({
      name: 'columns',
      title: 'Antal kolonner',
      type: 'string',
      description: 'Gælder kun for "Gitter" layout.',
      options: {
        list: [
          {title: 'Automatisk', value: 'auto'},
          {title: '2 kolonner', value: '2'},
          {title: '3 kolonner', value: '3'},
          {title: '4 kolonner', value: '4'},
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'layout',
      title: 'Layout type',
      type: 'string',
      options: {
        list: [
          {title: 'Gitter (Standard)', value: 'grid'},
          {title: 'Magasin (Variation)', value: 'magazine'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Billedformat',
      type: 'string',
      description: 'Gælder kun for "Gitter" layout.',
      options: {
        list: [
          {title: 'Landskab (16:9)', value: 'landscape'},
          {title: 'Kvadratisk (1:1)', value: 'square'},
          {title: 'Portræt (3:4)', value: 'portrait'},
        ],
        layout: 'radio',
      },
      initialValue: 'landscape',
    }),
    defineField({
      name: 'initialCount',
      title: 'Antal billeder (start)',
      type: 'number',
      description: 'Hvor mange billeder skal vises før "Vis flere" knappen?',
      initialValue: 9,
    }),
  ],
  preview: {
    select: {title: 'heading', images: 'images'},
    prepare({title, images}) {
      return {
        title: title || 'Galleri sektion',
        subtitle: `Galleri — ${images?.length || 0} billeder`,
      }
    },
  },
})
