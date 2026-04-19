import {defineArrayMember, defineField, defineType} from 'sanity'

export const restaurantMenuTeaserSectionType = defineType({
  name: 'restaurantMenuTeaserSection',
  title: 'Restaurant Menu Teaser',
  type: 'object',
  fields: [
    defineField({name: 'menuTeaserEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'menuTeaserHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'menuTeaserDescription', title: 'Beskrivelse', type: 'text', rows: 2}),
    defineField({
      name: 'menuServices',
      title: 'Serveringer',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            defineField({name: 'timeLabel', title: 'Tider', type: 'string'}),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 3}),
            defineField({name: 'priceFrom', title: 'Pris fra', type: 'number'}),
            defineField({name: 'priceLabel', title: 'Pris label', type: 'string'}),
            defineField({name: 'image', title: 'Billede', type: 'image', options: {hotspot: true}}),
          ],
        }),
      ],
    }),
    defineField({name: 'menuCtaLabel', title: 'Knap tekst', type: 'string'}),
    defineField({name: 'menuCtaUrl', title: 'Knap URL', type: 'string'}),
  ],
  preview: {
    select: {title: 'menuTeaserHeading'},
    prepare({title}) {
      return {title: `Menu Teaser: ${title || 'Uden overskrift'}`}
    },
  },
})
