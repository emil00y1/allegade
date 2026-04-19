import {defineField, defineType} from 'sanity'

export const selskaberTeaserSectionType = defineType({
  name: 'selskaberTeaserSection',
  title: 'Selskaber Teaser Sektion',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      initialValue: 'Hold Dit Selskab Hos Os',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Knap tekst',
      type: 'string',
      initialValue: 'Kontakt os',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Knap URL',
      type: 'string',
      initialValue: '/kontakt',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Baggrundsbillede',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt-tekst', type: 'string'})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: `Selskaber Teaser: ${title}`}
    },
  },
})
