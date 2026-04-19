import {defineArrayMember, defineField, defineType} from 'sanity'

export const selskaberOccasionsSectionType = defineType({
  name: 'selskaberOccasionsSection',
  title: 'Selskaber Anledninger',
  type: 'object',
  fields: [
    defineField({
      name: 'occasions',
      title: 'Anledninger',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Fane label', type: 'string'}),
            defineField({name: 'heading', title: 'Overskrift', type: 'string'}),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 3}),
            defineField({name: 'capacity', title: 'Kapacitet', type: 'string'}),
            defineField({name: 'facilities', title: 'Faciliteter', type: 'string'}),
            defineField({
              name: 'image',
              title: 'Billede',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt tekst'})],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Selskaber Anledninger (Faner)'}
    },
  },
})
