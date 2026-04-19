import {defineField, defineType} from 'sanity'

export const eventsArchiveSectionType = defineType({
  name: 'eventsArchiveSection',
  title: 'Begivenheder Arkiv',
  type: 'object',
  fields: [
    defineField({name: 'archiveEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'archiveHeading', title: 'Overskrift', type: 'string'}),
  ],
  preview: {
    prepare() {
      return {title: 'Begivenheder Arkiv'}
    },
  },
})
