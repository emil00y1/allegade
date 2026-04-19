import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const redirectType = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'Fra (sti)',
      type: 'string',
      description: 'Stien der skal omdirigeres fra, f.eks. /kontakt',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (value && !value.startsWith('/')) {
              return 'Stien skal starte med /'
            }
            return true
          }),
    }),
    defineField({
      name: 'destination',
      title: 'Til (sti)',
      type: 'string',
      description: 'Stien der skal omdirigeres til, f.eks. /om-os',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (value && !value.startsWith('/') && !value.startsWith('http')) {
              return 'Stien skal starte med / eller http'
            }
            return true
          }),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      description: 'Permanent redirect (301) eller midlertidig (302)',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent',
    },
    prepare({source, destination, permanent}) {
      return {
        title: `${source} → ${destination}`,
        subtitle: permanent ? '301 (permanent)' : '302 (midlertidig)',
      }
    },
  },
})
