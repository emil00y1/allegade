import {defineArrayMember, defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const offersSectionType = defineType({
  name: 'offersSection',
  type: 'object',
  title: 'Tilbud / Pakker',
  icon: TagIcon,
  description: 'Vis tilbud eller pakker med pris, billede og handlingsknap.',
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
      name: 'offers',
      title: 'Tilbud',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'offer',
          title: 'Tilbud',
          fields: [
            defineField({
              name: 'title',
              title: 'Titel',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Beskrivelse',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'price',
              title: 'Pris',
              description: 'F.eks. "Fra 595 kr." eller "1.295 kr. pr. person"',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Billede',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'badge',
              title: 'Badge',
              description: 'Valgfri mærkat, f.eks. "Populær" eller "Nyt"',
              type: 'string',
            }),
            defineField({
              name: 'ctaLabel',
              title: 'Knap tekst',
              type: 'string',
            }),
            defineField({
              name: 'ctaUrl',
              title: 'Knap URL',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'price', media: 'image'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', offers: 'offers'},
    prepare({title, offers}) {
      return {
        title: title || 'Tilbud / Pakker',
        subtitle: offers?.length
          ? `${offers.length} tilbud`
          : 'Ingen tilbud',
      }
    },
  },
})
