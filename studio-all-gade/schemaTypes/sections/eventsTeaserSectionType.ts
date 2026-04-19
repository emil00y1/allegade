import {defineField, defineType} from 'sanity'

export const eventsTeaserSectionType = defineType({
  name: 'eventsTeaserSection',
  title: 'Events Teaser Sektion',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Oplevelser',
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      initialValue: 'Events på Allégade 10',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'allEventsLabel',
      title: 'Se alle events label',
      type: 'string',
      initialValue: 'Se alle events',
    }),
    defineField({
      name: 'allEventsUrl',
      title: 'Se alle events URL',
      type: 'string',
      initialValue: '/events',
    }),
    defineField({
      name: 'eventCtaLabel',
      title: 'Event kort knap tekst',
      type: 'string',
      initialValue: 'Bestil billet',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: `Events Teaser: ${title}`}
    },
  },
})
