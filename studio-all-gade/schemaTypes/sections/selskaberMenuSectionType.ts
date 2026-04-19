import {defineField, defineType} from 'sanity'

export const selskaberMenuSectionType = defineType({
  name: 'selskaberMenuSection',
  title: 'Selskaber Menuer',
  type: 'object',
  fields: [
    defineField({name: 'menuEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'menuHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'menuDescription', title: 'Beskrivelse', type: 'text', rows: 2}),
    defineField({name: 'menuPdfUrl', title: 'PDF link', type: 'string'}),
    defineField({name: 'menuPdfFallbackLabel', title: 'PDF Knap Tekst', type: 'string'}),
    defineField({name: 'menuCardFallbackLabel', title: 'Fallback Knap Tekst', type: 'string'}),
  ],
  preview: {
    select: {title: 'menuHeading'},
    prepare({title}) {
      return {title: `Selskaber Menuer: ${title || 'Uden overskrift'}`}
    },
  },
})
