import {defineField, defineType} from 'sanity'
import {CopyIcon} from '@sanity/icons'

export const reusableBlockReferenceSectionType = defineType({
  name: 'reusableBlockReferenceSection',
  type: 'object',
  title: 'Genanvendelig blok',
  icon: CopyIcon,
  description: 'Indsæt indholdet fra en genanvendelig blok.',
  fields: [
    defineField({
      name: 'block',
      title: 'Blok',
      type: 'reference',
      to: [{type: 'reusableBlock'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'block.title'},
    prepare({title}) {
      return {
        title: title || 'Genanvendelig blok',
        subtitle: 'Genanvendt indhold',
      }
    },
  },
})
