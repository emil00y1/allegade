import {defineArrayMember, defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons'

export const testimonialsSectionType = defineType({
  name: 'testimonialsSection',
  type: 'object',
  title: 'Udtalelser',
  icon: CommentIcon,
  description: 'Udtalelser fra gæster med citat, navn og evt. billede.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'testimonials',
      title: 'Udtalelser',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'testimonial',
          title: 'Udtalelse',
          fields: [
            defineField({
              name: 'quote',
              title: 'Citat',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Navn',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Rolle / Titel',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Billede',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'quote'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', testimonials: 'testimonials'},
    prepare({title, testimonials}) {
      return {
        title: title || 'Udtalelser',
        subtitle: testimonials?.length
          ? `${testimonials.length} udtalelse${testimonials.length === 1 ? '' : 'r'}`
          : 'Ingen udtalelser',
      }
    },
  },
})
