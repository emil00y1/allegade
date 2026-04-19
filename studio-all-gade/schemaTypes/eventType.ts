import {defineArrayMember, defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {BulkImageArrayInput} from '../components/BulkImageArrayInput'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
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
      name: 'publishAt',
      title: 'Planlagt publicering',
      description:
        'Valgfrit. Hvis angivet, vises eventet først for besøgende efter denne dato og tid.',
      type: 'datetime',
    }),
    defineField({
      name: 'unpublishAt',
      title: 'Automatisk afpublicering',
      description:
        'Valgfrit. Hvis angivet, skjules eventet automatisk for besøgende efter denne dato og tid.',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((unpublishAt, context) => {
          const publishAt = context.document?.publishAt
          if (
            publishAt &&
            unpublishAt &&
            new Date(unpublishAt as string) <= new Date(publishAt as string)
          ) {
            return 'Afpubliceringsdato skal være efter publiceringsdatoen'
          }
          return true
        }),
    }),
    defineField({
      name: 'startDate',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = context.document?.startDate
          if (startDate && endDate && new Date(endDate as string) < new Date(startDate as string)) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'price',
      type: 'number',
    }),
    defineField({
      name: 'priceDescription',
      type: 'string',
    }),
    defineField({
      name: 'category',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
    }),
    defineField({
      name: 'image',
      type: 'image',
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
      title: 'Billedgalleri',
      description: 'Yderligere billeder til eventet (ud over hovedbilledet).',
      type: 'array',
      components: {input: BulkImageArrayInput},
      of: [
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            }),
          ],
        }),
      ],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
    }),
    defineField({
      name: 'menu',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuCourse',
          fields: [
            defineField({
              name: 'course',
              type: 'string',
            }),
            defineField({
              name: 'description',
              type: 'text',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
  orderings: [
    {
      title: 'Startdato (nyeste først)',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
    {
      title: 'Startdato (ældste først)',
      name: 'startDateAsc',
      by: [{field: 'startDate', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', startDate: 'startDate', publishAt: 'publishAt', unpublishAt: 'unpublishAt'},
    prepare({title, startDate, publishAt, unpublishAt}) {
      const now = new Date()
      const isScheduled = publishAt && new Date(publishAt) > now
      const isExpired = unpublishAt && new Date(unpublishAt) <= now
      const dateStr = startDate
        ? new Date(startDate).toLocaleDateString('da-DK', {day: 'numeric', month: 'short', year: 'numeric'})
        : ''
      let status = ''
      if (isExpired) status = ' ⛔ Afpubliceret'
      else if (isScheduled) status = ' ⏳ Planlagt'
      return {
        title: title || 'Unavngivet event',
        subtitle: `${dateStr}${status}`,
      }
    },
  },
})
