import {defineArrayMember, defineField, defineType} from 'sanity'

export const selskaberVenuesSectionType = defineType({
  name: 'selskaberVenuesSection',
  title: 'Selskaber Lokaler',
  type: 'object',
  fields: [
    defineField({name: 'venueEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'venueHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'venueCtaLabel', title: 'Knap tekst', type: 'string'}),
    defineField({
      name: 'venues',
      title: 'Lokaler',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'venueEntry',
          title: 'Lokale',
          fields: [
            defineField({name: 'name', title: 'Navn', type: 'string'}),
            defineField({name: 'capacity', title: 'Kapacitet', type: 'string'}),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 3}),
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
    select: {title: 'venueHeading'},
    prepare({title}) {
      return {title: `Selskaber Lokaler: ${title || 'Uden overskrift'}`}
    },
  },
})
