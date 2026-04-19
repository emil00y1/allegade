import {defineField, defineType} from 'sanity'

export const eventsListSectionType = defineType({
  name: 'eventsListSection',
  title: 'Begivenheder Liste',
  type: 'object',
  fields: [
    defineField({name: 'upcomingHeading', title: 'Overskrift', type: 'string'}),
    defineField({name: 'emptyStateHeading', title: 'Tom tilstand - overskrift', type: 'string'}),
    defineField({name: 'emptyStateText', title: 'Tom tilstand - tekst', type: 'string'}),
    defineField({name: 'freeLabel', title: 'Gratis label', type: 'string'}),
  ],
  preview: {
    prepare() {
      return {title: 'Begivenheder Liste'}
    },
  },
})
