import {defineArrayMember, defineField, defineType} from 'sanity'

export const hotelArrivalSectionType = defineType({
  name: 'hotelArrivalSection',
  title: 'Hotel Ankomst & Ophold',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Praktisk info'}),
    defineField({name: 'heading', title: 'Overskrift', type: 'string', initialValue: 'Alt du skal vide om'}),
    defineField({name: 'headingItalic', title: 'Overskrift (kursiv del)', type: 'string', initialValue: 'dit ophold'}),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 2,
      initialValue: 'Her finder du de vigtigste oplysninger, så dit ophold starter og slutter godt.',
    }),
    defineField({
      name: 'arrivalItems',
      title: 'Info-punkter',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'emoji',
              title: 'Emoji / Symbol',
              type: 'string',
              description: 'Ét emoji-tegn der repræsenterer punktet, f.eks. 🕒',
            }),
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            defineField({name: 'description', title: 'Beskrivelse', type: 'text', rows: 2}),
            defineField({name: 'note', title: 'Note (valgfri)', type: 'string', description: 'F.eks. "Tidlig check-in mod gebyr"'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
            prepare({title, subtitle}) {
              return {title: title || 'Info-punkt', subtitle}
            },
          },
        }),
      ],
      initialValue: [
        {emoji: '🕒', title: 'Check-in', description: 'Fra kl. 15:00', note: 'Tidlig check-in kan arrangeres mod gebyr'},
        {emoji: '🕙', title: 'Check-out', description: 'Inden kl. 11:00', note: 'Sen check-out mod gebyr efter aftale'},
        {emoji: '🚗', title: 'Parkering', description: 'Gadeparkering tilgængelig på Allégade og omliggende gader'},
        {emoji: '📶', title: 'WiFi', description: 'Gratis højhastigheds WiFi i alle rum og fællesarealer'},
        {emoji: '☕', title: 'Morgenmad', description: 'Serveres kl. 07:30–10:00 i restauranten'},
        {emoji: '🐾', title: 'Kæledyr', description: 'Vi er desværre ikke et kæledyrsvenligt hotel'},
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: `Ankomst & Ophold: ${title || 'Uden overskrift'}`}
    },
  },
})
