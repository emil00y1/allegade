import {defineField, defineType} from 'sanity'

export const selskaberHeroSectionType = defineType({
  name: 'selskaberHeroSection',
  title: 'Selskaber Hero',
  type: 'object',
  fields: [
    defineField({name: 'heroImage', title: 'Billede', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroHeading', title: 'Overskrift linje 1', type: 'string'}),
    defineField({name: 'heroHeadingItalic', title: 'Overskrift kursiv (2. linje)', type: 'string'}),
    defineField({name: 'heroDescription', title: 'Beskrivelse', type: 'text', rows: 3}),
    defineField({name: 'heroCtaLabel', title: 'Primær CTA tekst', type: 'string'}),
    defineField({name: 'heroMenuCtaLabel', title: 'Sekundær CTA tekst', type: 'string'}),
    defineField({name: 'heroMenuCtaUrl', title: 'Sekundær CTA link', type: 'string'}),
  ],
  preview: {
    select: {title: 'heroHeading'},
    prepare({title}) {
      return {title: `Selskaber Hero: ${title || 'Uden overskrift'}`}
    },
  },
})
