import {defineField, defineType} from 'sanity'

export const homeHeroSectionType = defineType({
  name: 'homeHeroSection',
  title: 'Home Hero Sektion',
  type: 'object',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Kulturel perle i Frederiksbergs centrum',
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      initialValue: 'Velkommen til',
    }),
    defineField({
      name: 'headingItalic',
      title: 'Overskrift (kursiv)',
      type: 'string',
      initialValue: 'Allégade 10',
    }),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'Primær knap – tekst',
      type: 'string',
      initialValue: 'Find dit bord',
    }),
    defineField({
      name: 'ctaPrimaryUrl',
      title: 'Primær knap – URL',
      type: 'string',
      initialValue: 'https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10',
      validation: (rule) =>
        rule.custom((val) => {
          if (!val) return true
          if (val.startsWith('/') || val.startsWith('#')) return true
          try {
            new URL(val)
            return true
          } catch {
            return 'Ugyldig URL — brug /sti, #anker eller https://...'
          }
        }),
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'Sekundær knap – tekst',
      type: 'string',
      initialValue: 'Se vores værelser',
    }),
    defineField({
      name: 'ctaSecondaryUrl',
      title: 'Sekundær knap – URL',
      type: 'string',
      initialValue: '/hotel',
      validation: (rule) =>
        rule.custom((val) => {
          if (!val) return true
          if (val.startsWith('/') || val.startsWith('#')) return true
          try {
            new URL(val)
            return true
          } catch {
            return 'Ugyldig URL — brug /sti, #anker eller https://...'
          }
        }),
    }),
    defineField({
      name: 'sideText',
      title: 'Lodret sidetekst',
      type: 'string',
      initialValue: 'Siden 1780 — Frederiksberg',
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Baggrundsvideo',
      type: 'file',
      options: {accept: 'video/*'},
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Baggrundsbillede (fallback)',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: `Hero: ${title || 'Uden overskrift'}`}
    },
  },
})
