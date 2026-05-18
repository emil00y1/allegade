import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const selskaberCtaBannerSectionType = defineType({
  name: 'selskaberCtaBannerSection',
  title: 'Selskaber CTA Banner',
  type: 'object',
  icon: LinkIcon,
  description: 'Kompakt bannerstribe med tekst og CTA-knap.',
  fields: [
    defineField({name: 'ctaBannerHeading', title: 'Tekst', type: 'string', initialValue: 'Hold dit selskab hos os'}),
    defineField({name: 'ctaBannerButtonLabel', title: 'Knap tekst', type: 'string', initialValue: 'Læs mere'}),
    defineField({name: 'ctaBannerButtonUrl', title: 'Knap link', type: 'string', initialValue: '/selskaber'}),
  ],
  preview: {
    select: {title: 'ctaBannerHeading'},
    prepare({title}) {
      return {
        title: title || 'Selskaber CTA Banner',
        subtitle: 'CTA Banner',
      }
    },
  },
})
