import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faqSectionType = defineType({
  name: 'faqSection',
  type: 'object',
  title: 'FAQ',
  icon: HelpCircleIcon,
  description: 'Ofte stillede spørgsmål i accordion-format.',
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
      name: 'items',
      title: 'Spørgsmål',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'Spørgsmål',
          fields: [
            defineField({
              name: 'question',
              title: 'Spørgsmål',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Svar',
              type: 'array',
              of: [defineArrayMember({type: 'block'})],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'question'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare({title, items}) {
      return {
        title: title || 'FAQ',
        subtitle: items?.length ? `${items.length} spørgsmål` : 'Ingen spørgsmål',
      }
    },
  },
})
