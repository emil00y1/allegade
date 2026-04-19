import {defineArrayMember, defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons'

export const textImageSectionType = defineType({
  name: 'textImageSection',
  type: 'object',
  title: 'Tekst & Billede',
  icon: SplitHorizontalIcon,
  description: 'Tekst ved siden af et billede — vælg højre/venstre placering og baggrundfarve.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Underoverskrift',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Brødtekst',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Knap tekst',
      type: 'string',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Knap URL',
      type: 'string',
      validation: (rule) =>
        rule.custom((val) => {
          if (!val) return true
          if (val.startsWith('/') || val.startsWith('#')) return true
          try {
            new URL(val)
            return true
          } catch {
            return 'Ugyldig URL — brug /sti, #anker eller https://...'
          }
        }),
    }),
    defineField({
      name: 'image',
      title: 'Billede',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst',
          type: 'string',
        }),
        defineField({
          name: 'caption',
          title: 'Billedtekst',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Billedets placering',
      type: 'string',
      options: {
        list: [
          {title: 'Højre', value: 'right'},
          {title: 'Venstre', value: 'left'},
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Baggrundfarve',
      type: 'string',
      options: {
        list: [
          {title: 'Hvid', value: 'white'},
          {title: 'Varm Beige', value: 'beige'},
          {title: 'Mørk', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'subheading',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Tekst & Billede sektion',
        subtitle: subtitle || '',
        media,
      }
    },
  },
})
