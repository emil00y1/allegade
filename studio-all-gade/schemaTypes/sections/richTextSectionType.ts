import {defineArrayMember, defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

export const richTextSectionType = defineType({
  name: 'richTextSection',
  type: 'object',
  title: 'Rig Tekst',
  icon: TextIcon,
  description: 'Fritekst-sektion med overskrift og brødtekst — vælg justering, bredde og baggrund.',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Øjebryns-tekst (over overskriften)',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Brødtekst',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
      ],
    }),
    defineField({
      name: 'alignment',
      title: 'Tekstjustering',
      type: 'string',
      options: {
        list: [
          {title: 'Venstre', value: 'left'},
          {title: 'Center', value: 'center'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Tekstbredde',
      type: 'string',
      options: {
        list: [
          {title: 'Smal', value: 'narrow'},
          {title: 'Medium', value: 'medium'},
          {title: 'Fuld', value: 'full'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Baggrundfarve',
      type: 'string',
      options: {
        list: [
          {title: 'Hvid', value: 'white'},
          {title: 'Varm Beige', value: 'beige'},
          {title: 'Mørk', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Rig tekst sektion',
        subtitle: 'Rig Tekst',
      }
    },
  },
})
