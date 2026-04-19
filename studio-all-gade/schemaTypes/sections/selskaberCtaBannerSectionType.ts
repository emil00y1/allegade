import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const selskaberCtaBannerSectionType = defineType({
  name: 'selskaberCtaBannerSection',
  title: 'Selskaber CTA Banner',
  type: 'object',
  icon: LinkIcon,
  description: 'Billedebanner med overskrift og knap til selskabssiden.',
  fields: [
    defineField({
      name: 'ctaBannerImage',
      title: 'Billede',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt tekst', type: 'string'})],
    }),
    defineField({name: 'ctaBannerHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'ctaBannerButtonLabel', title: 'Knap tekst', type: 'string'}),
  ],
  preview: {
    select: {title: 'ctaBannerHeading', media: 'ctaBannerImage'},
    prepare({title, media}) {
      return {
        title: title || 'Selskaber CTA Banner',
        subtitle: 'CTA Banner',
        media,
      }
    },
  },
})
