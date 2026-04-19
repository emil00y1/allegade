import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const selskaberInquiryType = defineType({
  name: 'selskaberInquiry',
  title: 'Selskabsforespørgsler',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({name: 'name', title: 'Navn', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'Email', type: 'string', readOnly: true}),
    defineField({name: 'occasion', title: 'Anledning', type: 'string', readOnly: true}),
    defineField({name: 'guestCount', title: 'Antal gæster', type: 'number', readOnly: true}),
    defineField({name: 'desiredDate', title: 'Ønsket dato', type: 'string', readOnly: true}),
    defineField({name: 'message', title: 'Besked', type: 'text', readOnly: true}),
    defineField({name: 'submittedAt', title: 'Indsendt', type: 'datetime', readOnly: true}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          {title: '🟡 Ny', value: 'new'},
          {title: '🔵 Kontaktet', value: 'contacted'},
          {title: '🟢 Bekræftet', value: 'confirmed'},
          {title: '🔴 Afvist', value: 'declined'},
        ],
        layout: 'radio',
      },
    }),
  ],
  orderings: [
    {
      title: 'Nyeste først',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'occasion',
      description: 'submittedAt',
    },
    prepare({title, subtitle, description}) {
      const date = description ? new Date(description).toLocaleDateString('da-DK') : ''
      return {
        title: title ?? 'Ukendt',
        subtitle: [subtitle, date].filter(Boolean).join(' · '),
      }
    },
  },
})
