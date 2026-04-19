import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuTabsSectionType = defineType({
  name: 'menuTabsSection',
  title: 'Menukort Faner',
  type: 'object',
  fields: [
    defineField({
      name: 'tabs',
      title: 'Faner',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({
              name: 'menuType',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Brunch', value: 'brunch'},
                  {title: 'Frokost', value: 'lunch'},
                  {title: 'Aften', value: 'dinner'},
                  {title: 'Drikkevarer', value: 'beverages'},
                ],
              },
            }),
            defineField({name: 'servingTime', title: 'Tid', type: 'string'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Menukort Faner'}
    },
  },
})
