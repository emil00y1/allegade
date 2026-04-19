import {defineField, defineType} from 'sanity'

export const welcomeSectionType = defineType({
  name: 'welcomeSection',
  title: 'Velkomst Sektion',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Vores Historie',
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      initialValue: 'Et samlingspunkt gennem århundreder',
    }),
    defineField({
      name: 'paragraph1',
      title: 'Afsnit 1',
      type: 'text',
      rows: 3,
      initialValue: 'Siden 1797 har Allégade 10 været rammen om Frederiksbergs mest betydningsfulde møder. Her, hvor de gamle lindetræer kaster skygger over de historiske mure, fortsætter vi traditionen med klassisk dansk gæstfrihed.',
    }),
    defineField({
      name: 'paragraph2',
      title: 'Afsnit 2',
      type: 'text',
      rows: 3,
      initialValue: 'Vores køkken forener det bedste fra det traditionelle danske smørrebrød med moderne europæiske teknikker, altid med fokus på sæsonens fineste råvarer og det gode håndværk.',
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link tekst',
      type: 'string',
      initialValue: 'Læs mere',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
      initialValue: '/om-os',
    }),
    defineField({
      name: 'image',
      title: 'Billede',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt-tekst', type: 'string'})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: `Velkomst: ${title || 'Uden overskrift'}`}
    },
  },
})
