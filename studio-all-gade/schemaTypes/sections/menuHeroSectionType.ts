import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuHeroSectionType = defineType({
  name: 'menuHeroSection',
  title: 'Menukort Hero',
  type: 'object',
  fields: [
    defineField({name: 'headerHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'headerDescription', title: 'Beskrivelse', type: 'text', rows: 2}),
    defineField({
      name: 'headerImage',
      title: 'Billede',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt tekst'})],
    }),
    defineField({
      name: 'headerServingTimes',
      title: 'Serveringstider',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Navn', type: 'string'}),
            defineField({name: 'time', title: 'Tid', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({name: 'bookTableLabel', title: 'Booking knap tekst', type: 'string'}),
    defineField({name: 'bookTableUrl', title: 'Booking knap URL', type: 'string'}),
  ],
  preview: {
    select: {title: 'headerHeading'},
    prepare({title}) {
      return {title: `Menu Hero: ${title || 'Uden overskrift'}`}
    },
  },
})
