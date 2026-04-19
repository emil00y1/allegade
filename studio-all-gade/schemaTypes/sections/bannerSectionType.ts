import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const bannerSectionType = defineType({
  name: 'bannerSection',
  type: 'object',
  title: 'Banner',
  icon: ImageIcon,
  description: 'Fuldbredde-banner med baggrundsbillede, overskrift, tekst og valgfri knap.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Undertekst',
      type: 'text',
      rows: 2,
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
      name: 'backgroundImage',
      title: 'Baggrundsbillede',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt tekst', type: 'string'})],
    }),
    defineField({
      name: 'overlay',
      title: 'Overlay mørke',
      description: 'Hvor mørkt overlayet på billedet skal være.',
      type: 'string',
      options: {
        list: [
          {title: 'Lys', value: 'light'},
          {title: 'Medium', value: 'medium'},
          {title: 'Mørk', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'size',
      title: 'Bannerhøjde',
      type: 'string',
      options: {
        list: [
          {title: 'Lille', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Stor', value: 'large'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'backgroundImage'},
    prepare({title, media}) {
      return {
        title: title || 'Banner sektion',
        subtitle: 'Banner',
        media,
      }
    },
  },
})
