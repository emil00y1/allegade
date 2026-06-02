import {defineArrayMember, defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons'

export const menuCardType = defineType({
  name: 'menuCard',
  title: 'Menukort',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel (intern)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'menuType',
      title: 'Menu type',
      type: 'string',
      options: {
        list: [
          {title: 'Brunch', value: 'brunch'},
          {title: 'Frokost', value: 'lunch'},
          {title: 'Aften', value: 'dinner'},
          {title: 'Drikkevarer', value: 'beverages'},
          {title: 'Selskab', value: 'event'},
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Rækkefølge (lavere = vises først)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'intro',
      title: 'Intro tekst (vises øverst i fanen)',
      type: 'text',
      rows: 3,
    }),
    // ─── Fremhævet menu / accordion (f.eks. grillbuffet) ──────────────────────
    defineField({
      name: 'highlightMenu',
      title: 'Fremhævet menu / accordion (vises øverst i fanen)',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      description:
        'Valgfri udklappelig menu, f.eks. grillbuffet, der vises øverst i fanen som en notits man kan klikke for at åbne/lukke.',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Vis fremhævet menu',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'openByDefault',
          title: 'Åben som standard',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'noticeText',
          title: 'Notits / overskrift (klikbar)',
          type: 'string',
          description: 'F.eks. "Fredag og lørdag serveres grillbuffet"',
        }),
        defineField({
          name: 'badge',
          title: 'Mærkat',
          type: 'string',
          initialValue: 'Sæt-menu',
        }),
        defineField({
          name: 'title',
          title: 'Titel',
          type: 'string',
          description: 'F.eks. "Grillbuffet"',
        }),
        defineField({
          name: 'intro',
          title: 'Intro tekst',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'groups',
          title: 'Grupper',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'menuGroup',
              title: 'Gruppe',
              fields: [
                defineField({name: 'heading', title: 'Overskrift (valgfri)', type: 'string'}),
                defineField({
                  name: 'body',
                  title: 'Tekst (én linje pr. linjeskift)',
                  type: 'text',
                  rows: 3,
                }),
              ],
              preview: {
                select: {title: 'heading', subtitle: 'body'},
                prepare({title, subtitle}) {
                  return {title: title || 'Gruppe', subtitle}
                },
              },
            }),
          ],
        }),
        defineField({
          name: 'price',
          title: 'Pris (tekst)',
          type: 'string',
          description: 'F.eks. "345,-"',
        }),
        defineField({
          name: 'priceNote',
          title: 'Pris-note / varianter',
          type: 'string',
          description:
            'F.eks. "Med Shrimp Cocktail 395,- · Med Shrimp Cocktail & Rhubarb Trifli 445,-"',
        }),
        defineField({name: 'ctaLabel', title: 'Knap tekst', type: 'string'}),
        defineField({name: 'ctaUrl', title: 'Knap link', type: 'string'}),
      ],
    }),
    // ─── Featured card fields (used for Brunch) ───────────────────────────────
    defineField({
      name: 'featuredImage',
      title: 'Fremhævet billede (f.eks. brunch-foto)',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt tekst'})],
    }),
    defineField({
      name: 'price',
      title: 'Pris (tal, f.eks. 199)',
      type: 'number',
    }),
    defineField({
      name: 'priceString',
      title: 'Pris (tekst, f.eks. "199,-")',
      type: 'string',
    }),
    defineField({
      name: 'priceLabel',
      title: 'Pris label (f.eks. "pr. person")',
      type: 'string',
    }),
    defineField({
      name: 'menuNote',
      title: 'Note under prislisten (f.eks. "Inkl. kaffe, te...")',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Knap tekst (f.eks. "Book brunch")',
      type: 'string',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Knap link',
      type: 'string',
    }),
    // ─── Menu sections ────────────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Sektioner',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuSection',
          title: 'Sektion',
          fields: [
            defineField({name: 'sectionTitle', title: 'Sektionsnavn', type: 'string'}),
            defineField({
              name: 'sectionNote',
              title: 'Serveingstid / note under sektionsoverskrift',
              type: 'string',
              description: 'F.eks. "Man–Fre 11:30–16 / Lør–Søn 13–16"',
            }),
            defineField({
              name: 'displayStyle',
              title: 'Visningsstil',
              type: 'string',
              options: {
                list: [
                  {title: 'Standard liste', value: 'list'},
                  {title: 'Vinkort (to-linje layout)', value: 'wine'},
                  {title: 'Sæt-menu kort', value: 'featured'},
                ],
                layout: 'radio',
              },
              initialValue: 'list',
            }),
            defineField({
              name: 'items',
              title: 'Retter / varer',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'menuItem',
                  title: 'Ret',
                  fields: [
                    defineField({name: 'name', title: 'Navn', type: 'string'}),
                    defineField({
                      name: 'description',
                      title: 'Beskrivelse / tilbehør',
                      type: 'text',
                      rows: 2,
                    }),
                    defineField({
                      name: 'price',
                      title: 'Pris (tal)',
                      type: 'number',
                    }),
                    defineField({
                      name: 'priceString',
                      title: 'Pris (tekst, brug ved komplekse priser som "135/175,-")',
                      type: 'string',
                    }),
                    defineField({
                      name: 'note',
                      title: 'Note (f.eks. "Kun søndag–torsdag")',
                      type: 'string',
                    }),
                    defineField({
                      name: 'badge',
                      title: 'Mærke (f.eks. "V" for vegetar, "GF" for glutenfri)',
                      type: 'string',
                    }),
                  ],
                  preview: {
                    select: {title: 'name', subtitle: 'price'},
                    prepare({title, subtitle}) {
                      return {
                        title: title || 'Unavngivet ret',
                        subtitle: subtitle ? `${subtitle},-` : undefined,
                      }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'sectionTitle'},
            prepare({title}) {
              return {title: title || 'Unavngivet sektion'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'menuType'},
  },
})
