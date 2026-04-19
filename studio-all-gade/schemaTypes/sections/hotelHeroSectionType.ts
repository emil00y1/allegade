import {defineArrayMember, defineField, defineType} from 'sanity'

export const hotelHeroSectionType = defineType({
  name: 'hotelHeroSection',
  title: 'Hotel Hero',
  type: 'object',
  fields: [
    defineField({name: 'heroImage', title: 'Billede', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'heroHeadingItalic', title: 'Overskrift (kursiv)', type: 'string'}),
    defineField({name: 'heroDescription', title: 'Beskrivelse', type: 'text', rows: 4}),
    defineField({
      name: 'heroStats',
      title: 'Statistikker',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Værdi', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({name: 'heroPrimaryCtaLabel', title: 'Primær knap tekst', type: 'string'}),
    defineField({name: 'heroPrimaryCtaUrl', title: 'Primær knap URL', type: 'string'}),
    defineField({name: 'heroSecondaryCtaLabel', title: 'Sekundær knap tekst', type: 'string'}),
    defineField({name: 'heroSecondaryCtaUrl', title: 'Sekundær knap URL', type: 'string'}),
    defineField({name: 'heroFloatingStarText', title: 'Flydende tekst (stor)', type: 'string'}),
    defineField({name: 'heroFloatingSubtext', title: 'Flydende tekst (lille)', type: 'string'}),
    defineField({name: 'bookingCtaLabel', title: 'Booking knap tekst', type: 'string'}),
    defineField({name: 'bookingCtaUrl', title: 'Booking knap URL', type: 'string'}),
  ],
  preview: {
    select: {title: 'heroHeading'},
    prepare({title}) {
      return {title: `Hotel Hero: ${title || 'Uden overskrift'}`}
    },
  },
})
