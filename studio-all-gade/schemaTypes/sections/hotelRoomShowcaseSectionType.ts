import {defineField, defineType} from 'sanity'

export const hotelRoomShowcaseSectionType = defineType({
  name: 'hotelRoomShowcaseSection',
  title: 'Hotel Værelse Showcase',
  type: 'object',
  fields: [
    defineField({name: 'roomShowcaseHeading', title: 'Overskrift', type: 'string'}),
  ],
  preview: {
    select: {title: 'roomShowcaseHeading'},
    prepare({title}) {
      return {title: `Værelse Showcase: ${title || 'Uden overskrift'}`}
    },
  },
})
