import {defineArrayMember, defineField, defineType} from 'sanity'

export const hotelPracticalInfoSectionType = defineType({
  name: 'hotelPracticalInfoSection',
  title: 'Hotel Praktisk Info (FAQ)',
  type: 'object',
  fields: [
    defineField({name: 'practicalInfoHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'practicalInfoHeadingItalic', title: 'Overskrift (kursiv)', type: 'string'}),
    defineField({
      name: 'faqItems',
      title: 'FAQ Punkter',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Spørgsmål', type: 'string'}),
            defineField({name: 'answer', title: 'Svar', type: 'text', rows: 4}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'practicalInfoHeading'},
    prepare({title}) {
      return {title: `Praktisk Info: ${title || 'Uden overskrift'}`}
    },
  },
})
