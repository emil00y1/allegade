import {defineField, defineType} from 'sanity'

export const restaurantPhilosophySectionType = defineType({
  name: 'restaurantPhilosophySection',
  title: 'Restaurant Filosofi',
  type: 'object',
  fields: [
    defineField({name: 'philosophyImage', title: 'Baggrundsbillede', type: 'image', options: {hotspot: true}}),
    defineField({name: 'philosophyQuote', title: 'Citat', type: 'text', rows: 3}),
    defineField({name: 'philosophyAttribution', title: 'Tilskrivning', type: 'string'}),
  ],
  preview: {
    select: {title: 'philosophyQuote'},
    prepare({title}) {
      return {title: `Filosofi: ${title?.substring(0, 30)}...`}
    },
  },
})
