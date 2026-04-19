import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  description:
    'Alle felter er valgfrie. Hvis de ikke udfyldes, genereres værdier automatisk fra sidens indhold (titel, beskrivelse og billede).',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description:
        'Overstyrer sidetitlen i søgeresultater. Anbefalet: 50-60 tegn. Udfyldes automatisk fra sidens titel hvis tom.',
      validation: (rule) =>
        rule.max(70).warning('Meta title bør holdes under 70 tegn for bedste visning i søgeresultater.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description:
        'Kort beskrivelse vist i søgeresultater. Anbefalet: 150-160 tegn. Udfyldes automatisk fra sidens beskrivelse hvis tom.',
      validation: (rule) =>
        rule.max(170).warning('Meta description bør holdes under 170 tegn for bedste visning i søgeresultater.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Delingsbillede (Open Graph)',
      type: 'image',
      description:
        'Billedet der vises når siden deles på sociale medier. Udfyldes automatisk fra sidens primære billede hvis tomt.',
    }),
  ],
})
