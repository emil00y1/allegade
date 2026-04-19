import {defineArrayMember, defineField, defineType} from 'sanity'

export const hotelStorySectionType = defineType({
  name: 'hotelStorySection',
  title: 'Hotel Historie',
  type: 'object',
  fields: [
    defineField({name: 'storyImage', title: 'Billede', type: 'image', options: {hotspot: true}}),
    defineField({name: 'storyEyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Siden 1780'}),
    defineField({name: 'storyHeading', title: 'Overskrift', type: 'string', initialValue: 'En bygning med sjæl'}),
    defineField({name: 'storyHeadingItalic', title: 'Overskrift (kursiv del)', type: 'string', initialValue: 'og historie'}),
    defineField({
      name: 'storyBody',
      title: 'Brødtekst',
      type: 'text',
      rows: 6,
      initialValue:
        'Allégade 10 er en af Frederiksbergs ældste bygninger — opført i slutningen af 1700-tallet og siden da et samlingspunkt for byens liv. Gennem generationer har bygningen rummet gæster, der søgte mere end bare et sted at sove.\n\nI dag kombinerer vi historiens charme med moderne gæstfrihed. Hvert værelse bærer spor af fortiden, men er udstyret med alt, hvad der gør et ophold behageligt. Der er noget særligt ved at sove i en bygning med så mange lag af historie.',
    }),
    defineField({
      name: 'storyStats',
      title: 'Fakta/Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'value', title: 'Værdi', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
      initialValue: [
        {value: '1780', label: 'Grundlagt'},
        {value: '12', label: 'Unikke værelser'},
        {value: '200+', label: 'Års gæstfrihed'},
      ],
    }),
  ],
  preview: {
    select: {title: 'storyHeading'},
    prepare({title}) {
      return {title: `Hotel Historie: ${title || 'Uden overskrift'}`}
    },
  },
})
