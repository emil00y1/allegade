import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

export const jobPostingType = defineType({
  name: 'jobPosting',
  title: 'Jobopslag',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-sti',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
    }),
    defineField({
      name: 'employmentType',
      title: 'Ansættelsestype',
      type: 'string',
      options: {
        list: [
          {title: 'Fuldtid', value: 'fuldtid'},
          {title: 'Deltid', value: 'deltid'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'location',
      title: 'Lokation',
      type: 'string',
      initialValue: 'Frederiksberg',
    }),
    defineField({
      name: 'description',
      title: 'Kort beskrivelse',
      description: 'Vises i oversigten på karrieresiden.',
      type: 'text',
    }),
    defineField({
      name: 'body',
      title: 'Indhold',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'applicationEmail',
      title: 'Ansøgnings-email',
      description: 'E-mailadresse til ansøgninger.',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'applicationUrl',
      title: 'Ansøgnings-link',
      description: 'Alternativt link til ansøgningsformular (bruges i stedet for email, hvis angivet).',
      type: 'url',
    }),
    defineField({
      name: 'deadline',
      title: 'Ansøgningsfrist',
      type: 'datetime',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publiceringsdato',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishAt',
      title: 'Planlagt publicering',
      description:
        'Valgfrit. Hvis angivet, vises opslaget først for besøgende efter denne dato og tid.',
      type: 'datetime',
      hidden: ({document}) => document?.isActive === false,
    }),
    defineField({
      name: 'unpublishAt',
      title: 'Automatisk afpublicering',
      description:
        'Valgfrit. Hvis angivet, skjules opslaget automatisk for besøgende efter denne dato og tid.',
      type: 'datetime',
      hidden: ({document}) => document?.isActive === false,
      validation: (rule) =>
        rule.custom((unpublishAt, context) => {
          const publishAt = context.document?.publishAt
          if (
            publishAt &&
            unpublishAt &&
            new Date(unpublishAt as string) <= new Date(publishAt as string)
          ) {
            return 'Afpubliceringsdato skal være efter publiceringsdatoen'
          }
          return true
        }),
    }),
    defineField({
      name: 'isActive',
      title: 'Aktiv',
      description: 'Slå fra for at skjule opslaget.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Publiceringsdato (nyeste først)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Ansøgningsfrist (snarest)',
      name: 'deadlineAsc',
      by: [{field: 'deadline', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', isActive: 'isActive', employmentType: 'employmentType', publishAt: 'publishAt', unpublishAt: 'unpublishAt'},
    prepare({title, isActive, employmentType, publishAt, unpublishAt}) {
      const typeLabel = employmentType === 'fuldtid' ? 'Fuldtid' : employmentType === 'deltid' ? 'Deltid' : ''
      const now = new Date()
      const isScheduled = isActive !== false && publishAt && new Date(publishAt) > now
      const isExpired = isActive !== false && unpublishAt && new Date(unpublishAt) <= now
      let status = ''
      if (isActive === false) status = ' (inaktiv)'
      else if (isExpired) status = ' ⛔ Afpubliceret'
      else if (isScheduled) status = ' ⏳ Planlagt'
      return {
        title: title || 'Unavngivet jobopslag',
        subtitle: `${typeLabel}${status}`,
      }
    },
  },
})
