import {defineArrayMember, defineField, defineType} from 'sanity'

export const hotelNeighborhoodSectionType = defineType({
  name: 'hotelNeighborhoodSection',
  title: 'Hotel Nabolag',
  type: 'object',
  fields: [
    defineField({name: 'neighborhoodHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'neighborhoodHeadingItalic', title: 'Overskrift (kursiv)', type: 'string'}),
    defineField({name: 'neighborhoodAddress', title: 'Adresse', type: 'string'}),
    defineField({name: 'neighborhoodCity', title: 'By', type: 'string'}),
    defineField({name: 'neighborhoodMapUrl', title: 'Maps Embed URL', type: 'url'}),
    defineField({name: 'mapEyebrow', title: 'Kort Eyebrow', type: 'string'}),
    defineField({name: 'directionsLabel', title: 'Vejledning Label', type: 'string'}),
    defineField({
      name: 'neighborhoodItems',
      title: 'Highlights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            defineField({name: 'walkTime', title: 'Gåtid', type: 'string'}),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 2}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'neighborhoodHeading'},
    prepare({title}) {
      return {title: `Nabolag: ${title || 'Uden overskrift'}`}
    },
  },
})
