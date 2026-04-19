import {defineField, defineType} from 'sanity'

export const eventsHeroSectionType = defineType({
  name: 'eventsHeroSection',
  title: 'Begivenheder Hero',
  type: 'object',
  fields: [
    defineField({name: 'heroEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heroHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'heroHeadingItalic', title: 'Overskrift (kursiv)', type: 'string'}),
    defineField({name: 'heroDescription', title: 'Beskrivelse', type: 'text', rows: 3}),
    defineField({name: 'heroCtaLabel', title: 'Knap tekst', type: 'string'}),
    defineField({
      name: 'heroImage',
      title: 'Hero-billede',
      type: 'image',
      description: 'Vises i højre side af hero-sektionen. Falder tilbage til det første kommende arrangements billede.',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'heroHeading'},
    prepare({title}) {
      return {title: `Begivenheder Hero: ${title || 'Uden overskrift'}`}
    },
  },
})
