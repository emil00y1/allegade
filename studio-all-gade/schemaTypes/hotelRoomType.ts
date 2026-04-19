import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {BulkImageArrayInput} from '../components/BulkImageArrayInput'

export const hotelRoomType = defineType({
  name: 'hotelRoom',
  title: 'Hotel Værelse',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
    }),
    defineField({
      name: 'roomType',
      title: 'Værelses type',
      type: 'string',
      options: {
        list: [
          {title: 'Enkeltværelse', value: 'enkeltværelse'},
          {title: 'Dobbeltværelse', value: 'dobbeltværelse'},
          {title: '3-personers værelse', value: '3-personers'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'order',
      title: 'Rækkefølge (lavere = vises først)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'pricePerNight',
      title: 'Pris pr. nat (tal)',
      type: 'number',
    }),
    defineField({
      name: 'priceLabel',
      title: 'Prisbeskrivelse (f.eks. "Pris for 1 overnatning")',
      type: 'string',
      initialValue: 'Pris for 1 overnatning',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'note',
      title: 'OBS note (f.eks. "OBS: Da alle værelser er forskellige...")',
      type: 'string',
    }),
    defineField({
      name: 'features',
      title: 'Faciliteter / bullet points',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Booking knap tekst',
      type: 'string',
      initialValue: 'Book nu',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Booking knap link',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Primært billede',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galleri billeder',
      type: 'array',
      components: {input: BulkImageArrayInput},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Indhold (rigt tekst)',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'roomType', media: 'image'},
  },
})
