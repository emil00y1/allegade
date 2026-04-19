import {defineArrayMember, defineField, defineType} from 'sanity'

export const restaurantStorySectionType = defineType({
  name: 'restaurantStorySection',
  title: 'Restaurant Historie',
  type: 'object',
  fields: [
    defineField({name: 'storyImage', title: 'Billede', type: 'image', options: {hotspot: true}}),
    defineField({name: 'storyEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'storyHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'storyBody', title: 'Brødtekst', type: 'text', rows: 6}),
    defineField({
      name: 'storyStats',
      title: 'Fakta/Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'value', title: 'Værdi', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'storyHeading'},
    prepare({title}) {
      return {title: `Restaurant Historie: ${title || 'Uden overskrift'}`}
    },
  },
})
