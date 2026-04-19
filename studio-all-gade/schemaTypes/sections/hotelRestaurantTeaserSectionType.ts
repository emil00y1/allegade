import {defineField, defineType} from 'sanity'

export const hotelRestaurantTeaserSectionType = defineType({
  name: 'hotelRestaurantTeaserSection',
  title: 'Hotel Restaurant Teaser',
  type: 'object',
  fields: [
    defineField({name: 'restaurantEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'restaurantHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'restaurantHeadingItalic', title: 'Overskrift (kursiv)', type: 'string'}),
    defineField({name: 'restaurantDescription', title: 'Beskrivelse', type: 'text', rows: 3}),
    defineField({name: 'restaurantCtaLabel', title: 'Knap tekst', type: 'string'}),
    defineField({name: 'restaurantCtaUrl', title: 'Knap URL', type: 'string'}),
    defineField({name: 'restaurantImage', title: 'Billede', type: 'image', options: {hotspot: true}}),
  ],
  preview: {
    select: {title: 'restaurantHeading'},
    prepare({title}) {
      return {title: `Restaurant Teaser: ${title || 'Uden overskrift'}`}
    },
  },
})
