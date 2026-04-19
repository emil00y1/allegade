import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {BulkImageArrayInput} from '../components/BulkImageArrayInput'

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  icon: HomeIcon,
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
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'capacity',
      title: 'Kapacitet (antal personer)',
      type: 'number',
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensioner',
      description: 'F.eks. "12 x 8 meter".',
      type: 'string',
    }),
    defineField({
      name: 'facilities',
      title: 'Faciliteter',
      description: 'Liste over tilgængelige faciliteter i lokalet.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'image',
      title: 'Hovedbillede',
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
      name: 'floorPlan',
      title: 'Plantegning',
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
      name: 'body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
})
