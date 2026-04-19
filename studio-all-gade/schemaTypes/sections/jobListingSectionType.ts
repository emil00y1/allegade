import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

export const jobListingSectionType = defineType({
  name: 'jobListingSection',
  type: 'object',
  title: 'Jobopslag liste',
  icon: CaseIcon,
  description: 'Viser automatisk aktive jobopslag fra CMS.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      initialValue: 'Ledige stillinger',
    }),
    defineField({
      name: 'emptyStateText',
      title: 'Tekst når der ingen opslag er',
      type: 'string',
      initialValue: 'Vi har ingen ledige stillinger lige nu.',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Jobopslag liste',
        subtitle: 'Henter automatisk aktive jobopslag',
      }
    },
  },
})
