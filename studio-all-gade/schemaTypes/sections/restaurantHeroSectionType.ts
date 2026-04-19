import {defineField, defineType} from 'sanity'

export const restaurantHeroSectionType = defineType({
  name: 'restaurantHeroSection',
  title: 'Restaurant Hero',
  type: 'object',
  fields: [
    defineField({name: 'heroImage', title: 'Billede', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'heroHeadingItalic', title: 'Overskrift (kursiv)', type: 'string'}),
    defineField({name: 'heroDescription', title: 'Beskrivelse', type: 'text', rows: 3}),
    defineField({name: 'heroBookCtaLabel', title: 'Book bord tekst', type: 'string'}),
    defineField({name: 'heroBookCtaUrl', title: 'Book bord URL', type: 'string'}),
    defineField({name: 'heroMenuCtaLabel', title: 'Menukort tekst', type: 'string'}),
    defineField({name: 'heroMenuCtaUrl', title: 'Menukort URL', type: 'string'}),
  ],
  preview: {
    select: {title: 'heroHeading'},
    prepare({title}) {
      return {title: `Restaurant Hero: ${title || 'Uden overskrift'}`}
    },
  },
})
