import {defineArrayMember, defineField, defineType} from 'sanity'

export const hotelFacilitiesSectionType = defineType({
  name: 'hotelFacilitiesSection',
  title: 'Hotel Faciliteter',
  type: 'object',
  fields: [
    defineField({name: 'facilitiesHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'facilitiesHeadingItalic', title: 'Overskrift (kursiv)', type: 'string'}),
    defineField({name: 'facilitiesDescription', title: 'Beskrivelse', type: 'text', rows: 2}),
    defineField({
      name: 'facilities',
      title: 'Faciliteter Liste',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'icon', title: 'Ikon', type: 'image'}),
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 2}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'facilitiesHeading'},
    prepare({title}) {
      return {title: `Faciliteter: ${title || 'Uden overskrift'}`}
    },
  },
})
