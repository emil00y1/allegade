import {defineField, defineType} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons'

export const quoteSectionType = defineType({
  name: 'quoteSection',
  type: 'object',
  title: 'Citat',
  icon: BlockquoteIcon,
  description: 'Fremhævet citat med tilskrivning — valgfrit baggrundsbillede eller farve.',
  fields: [
    defineField({
      name: 'quote',
      title: 'Citat',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'attribution',
      title: 'Tilskrivning (f.eks. navn, titel)',
      type: 'string',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Baggrundsbillede (valgfrit)',
      description: 'Hvis sat, vises citatet med et mørkt overlay over billedet.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Baggrundfarve (bruges hvis intet billede)',
      type: 'string',
      options: {
        list: [
          {title: 'Hvid', value: 'white'},
          {title: 'Varm Beige', value: 'beige'},
          {title: 'Mørk', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'beige',
    }),
  ],
  preview: {
    select: {title: 'quote', subtitle: 'attribution'},
    prepare({title, subtitle}) {
      return {
        title: title ? `"${title.slice(0, 60)}…"` : 'Citat sektion',
        subtitle: subtitle ? `— ${subtitle}` : 'Citat',
      }
    },
  },
})
