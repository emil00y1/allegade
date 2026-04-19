import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const ctaBannerSectionType = defineType({
  name: 'ctaBannerSection',
  type: 'object',
  title: 'CTA Banner',
  icon: LinkIcon,
  description: 'Handlingsopfordring med overskrift, beskrivelse og op til to knapper.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Primær knap tekst',
      type: 'string',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Primær knap URL',
      type: 'string',
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
      title: 'Sekundær knap tekst (valgfrit)',
      type: 'string',
    }),
    defineField({
      name: 'ctaSecondaryUrl',
      title: 'Sekundær knap URL',
      type: 'string',
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
      name: 'style',
      title: 'Stil',
      type: 'string',
      options: {
        list: [
          {title: 'Mørk baggrund (lys tekst)', value: 'dark'},
          {title: 'Brand farve (lys tekst)', value: 'brand'},
          {title: 'Lys baggrund (mørk tekst)', value: 'light'},
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'ctaLabel'},
    prepare({title, subtitle}) {
      return {
        title: title || 'CTA Banner',
        subtitle: subtitle ? `Knap: ${subtitle}` : 'CTA Banner',
      }
    },
  },
})
