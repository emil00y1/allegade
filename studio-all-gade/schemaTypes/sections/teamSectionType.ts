import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const teamSectionType = defineType({
  name: 'teamSection',
  type: 'object',
  title: 'Team',
  icon: UsersIcon,
  description: 'Vis teammedlemmer med billede, navn, rolle og valgfri bio.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'members',
      title: 'Teammedlemmer',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'teamMember',
          title: 'Teammedlem',
          fields: [
            defineField({
              name: 'name',
              title: 'Navn',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Rolle / Titel',
              type: 'string',
            }),
            defineField({
              name: 'bio',
              title: 'Bio',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'image',
              title: 'Billede',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'role', media: 'image'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', members: 'members'},
    prepare({title, members}) {
      return {
        title: title || 'Team',
        subtitle: members?.length
          ? `${members.length} medlem${members.length === 1 ? '' : 'mer'}`
          : 'Ingen medlemmer',
      }
    },
  },
})
