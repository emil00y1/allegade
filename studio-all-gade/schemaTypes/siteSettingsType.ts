import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'
import {ThemePickerInput} from '../components/ThemePickerInput'
import {FontPickerInput} from '../components/FontPickerInput'
import {FontFileUploadInput} from '../components/FontFileUploadInput'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Indstillinger',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'Generelt'},
    {name: 'branding', title: 'Branding & Logo'},
    {name: 'navigation', title: 'Navigation'},
    {name: 'footer', title: 'Footer & Kontakt'},
    {name: 'newsletter', title: 'Nyhedsbrev'},
    {name: 'social', title: 'Sociale Medier'},
    {name: 'fonts', title: 'Skrifttyper'},
    {name: 'tracking', title: 'Tracking & Analytics'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Sidenavn',
      description: 'Navnet på hjemmesiden (bruges bl.a. i browser-titler).',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'general',
    }),

    // ─── Branding ─────────────────────────────────────────────────────────────
    defineField({
      name: 'favicon',
      title: 'Favicon',
      description: 'Ikonet der vises i browserens fane. Anbefales: PNG 64×64 px.',
      type: 'image',
      options: {accept: 'image/png,image/svg+xml,image/x-icon'},
      group: 'branding',
    }),

    defineField({
      name: 'colorTheme',
      title: 'Farvetema',
      description: 'Vælg det overordnede farvetema for hjemmesiden.',
      type: 'string',
      initialValue: 'warm-brown',
      components: {input: ThemePickerInput},
      group: 'branding',
    }),

    defineField({
      name: 'fontPairing',
      title: 'Skrifttype-kombination',
      description: 'Vælg hvilke skrifttyper der skal bruges sammen.',
      type: 'string',
      initialValue: 'classic',
      components: {input: FontPickerInput},
      group: 'branding',
    }),

    defineField({
      name: 'logoText',
      title: 'Logo tekst',
      description: 'Tekst der vises som logo. Hvis tom, bruges "Allégade 10".',
      type: 'string',
      group: 'branding',
    }),
    defineField({
      name: 'logoImage',
      title: 'Logo (Billede)',
      description: 'Upload et SVG eller PNG logo. Farven tilpasses automatisk temaet.',
      type: 'image',
      options: {accept: 'image/svg+xml,image/png'},
      group: 'branding',
    }),

    // ─── Navigation ───────────────────────────────────────────────────────────
    defineField({
      name: 'navigation',
      title: 'Hovedmenu (Desktop)',
      description: 'Links der vises i topmenuen på store skærme. Hvert punkt kan have undermenupunkter.',
      type: 'array',
      group: 'navigation',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navLink',
          title: 'Menu-punkt',
          fields: [
            defineField({name: 'name', title: 'Vist navn', type: 'string'}),
            defineField({
              name: 'pageReference',
              title: 'Henvis til side',
              description: 'Vælg en side fra CMS. Hvis valgt, bruges dens URL automatisk.',
              type: 'reference',
              to: [
                {type: 'page'},
                {type: 'hotelPage'},
                {type: 'restaurantPage'},
                {type: 'menuPage'},
                {type: 'eventsPage'},
                {type: 'selskaberPage'},
              ],
              weak: true,
            }),
            defineField({
              name: 'href',
              title: 'Manuel URL',
              description: 'Kun hvis du ikke har valgt en side ovenfor (f.eks. et eksternt link).',
              type: 'string',
            }),
            defineField({
              name: 'children',
              title: 'Undermenu',
              description: 'Valgfrit. Tilføj undermenupunkter der vises i en dropdown.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'navChildLink',
                  title: 'Undermenu-punkt',
                  fields: [
                    defineField({name: 'name', title: 'Vist navn', type: 'string'}),
                    defineField({
                      name: 'pageReference',
                      title: 'Henvis til side',
                      type: 'reference',
                      to: [
                        {type: 'page'},
                        {type: 'hotelPage'},
                        {type: 'restaurantPage'},
                        {type: 'menuPage'},
                        {type: 'eventsPage'},
                        {type: 'selskaberPage'},
                      ],
                      weak: true,
                    }),
                    defineField({
                      name: 'href',
                      title: 'Manuel URL',
                      type: 'string',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'ctaBookTableLabel',
      title: 'Booking knap tekst (Bord)',
      description: 'Teksten på den primære booking-knap i menuen.',
      type: 'string',
      initialValue: 'Book bord',
      group: 'navigation',
    }),
    defineField({
      name: 'ctaBookTableUrl',
      title: 'Booking link (Globalt)',
      description: 'Det primære link til bordbestilling (DinnerBooking). Gælder for hele sitet.',
      type: 'string',
      initialValue: 'https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10',
      group: 'navigation',
    }),
    defineField({
      name: 'ctaBookStayLabel',
      title: 'Booking knap tekst (Ophold)',
      type: 'string',
      initialValue: 'Book ophold',
      group: 'navigation',
    }),
    defineField({
      name: 'ctaBookStayUrl',
      title: 'Booking link (Ophold)',
      type: 'string',
      initialValue: 'https://allegade10.suitcasebooking.com/da',
      group: 'navigation',
    }),
    defineField({
      name: 'headerMenuOpenLabel',
      title: 'Menu-knap tekst (Åbn)',
      type: 'string',
      initialValue: 'Åbn menu',
      group: 'navigation',
    }),
    defineField({
      name: 'headerMenuCloseLabel',
      title: 'Menu-knap tekst (Luk)',
      type: 'string',
      initialValue: 'Luk menu',
      group: 'navigation',
    }),

    // ─── Footer & Contact ──────────────────────────────────────────────────
    defineField({
      name: 'address',
      title: 'Fysisk adresse',
      type: 'text',
      rows: 2,
      group: 'footer',
    }),
    defineField({
      name: 'phone',
      title: 'Telefonnummer',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'email',
      title: 'E-mail adresse',
      type: 'string',
      validation: (rule) => rule.email(),
      group: 'footer',
    }),
    defineField({
      name: 'footerDescription',
      title: 'Kort beskrivelse i footer',
      description: 'En lille tekst om Allégade 10 til bunden af siden.',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),
    defineField({
      name: 'restaurantHours',
      title: 'Åbningstider (Restaurant)',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'restaurantHourEntry',
          title: 'Åbningstid',
          fields: [
            defineField({name: 'days', title: 'Dage', type: 'string', placeholder: 'f.eks. Man-Tors'}),
            defineField({name: 'hours', title: 'Tidsrum', type: 'string', placeholder: 'f.eks. 11:30 - 22:00'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'kitchenClosingNote',
      title: 'Note om køkkenet',
      description: 'Vises under åbningstiderne. F.eks. "Køkkenet lukker 20:30".',
      type: 'string',
      initialValue: 'Køkkenet lukker 20:30',
      group: 'footer',
    }),
    defineField({
      name: 'footerRestaurantHoursLabel',
      title: 'Footer: Overskrift for åbningstider',
      type: 'string',
      initialValue: 'Restaurant',
      group: 'footer',
    }),
    defineField({
      name: 'footerContactLabel',
      title: 'Footer: Overskrift for kontakt',
      type: 'string',
      initialValue: 'Kontakt',
      group: 'footer',
    }),
    defineField({
      name: 'breadcrumbHomeLabel',
      title: 'Brødkrumme: Hjem-tekst',
      description: 'Teksten på "Hjem" i brødkrummen på undersider.',
      type: 'string',
      initialValue: 'Hjem',
      group: 'footer',
    }),
    defineField({
      name: 'cvr',
      title: 'CVR-nummer',
      description: 'Vises i footerens bundlinje. Påkrævet ved dansk erhvervsdrivende.',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerLinks',
      title: 'Links i bunden (Bundlinje)',
      description: 'Små links helt nederst (f.eks. Privatlivspolitik).',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Navn', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
        }),
      ],
    }),

    // ─── Newsletter ────────────────────────────────────────────────
    defineField({
      name: 'newsletterLabel',
      title: 'Overskrift (Lille)',
      type: 'string',
      initialValue: 'Nyhedsbrev',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterSubtext',
      title: 'Beskrivelse',
      type: 'string',
      initialValue: 'Hold dig opdateret på events og tilbud',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterButtonLabel',
      title: 'Knap tekst',
      type: 'string',
      initialValue: 'Tilmeld',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterFirstNameLabel',
      title: 'Fornavn felt tekst',
      type: 'string',
      initialValue: 'Fornavn',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterLastNameLabel',
      title: 'Efternavn felt tekst',
      type: 'string',
      initialValue: 'Efternavn',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterEmailLabel',
      title: 'Email felt tekst',
      type: 'string',
      initialValue: 'E-mailadresse',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterSuccessMessage',
      title: 'Besked ved succes',
      type: 'string',
      initialValue: 'Tak! Du er nu tilmeldt vores nyhedsbrev.',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterErrorMessage',
      title: 'Besked ved fejl',
      type: 'string',
      initialValue: 'Noget gik galt. Prøv igen senere.',
      group: 'newsletter',
    }),

    // ─── Social ─────────────────────────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Sociale profiler',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'X / Twitter', value: 'twitter'},
                  {title: 'Pinterest', value: 'pinterest'},
                ],
                layout: 'radio',
              },
            }),
            defineField({name: 'url', title: 'Link (URL)', type: 'url'}),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        }),
      ],
    }),

    // ─── Tracking & Analytics ──────────────────────────────────────────────
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics Målings-ID',
      description: 'F.eks. "G-XXXXXXXXXX". Lad feltet stå tomt for at deaktivere Google Analytics.',
      type: 'string',
      group: 'tracking',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          if (/^G-[A-Z0-9]+$/.test(value)) return true
          return 'Skal være et gyldigt Google Analytics 4 Målings-ID (f.eks. G-XXXXXXXXXX)'
        }),
    }),

    // ─── Custom Font Pairings ─────────────────────────────────────────────
    defineField({
      name: 'customFontPairings',
      title: 'Brugerdefinerede skrifttyper',
      description: 'Upload dine egne skrifttyper her.',
      type: 'array',
      group: 'fonts',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'customFontPairing',
          title: 'Skrifttype-par',
          fields: [
            defineField({
              name: 'label',
              title: 'Navn',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'headingFontUrl',
              title: 'Overskrift fil',
              type: 'string',
              components: {input: FontFileUploadInput},
            }),
            defineField({
              name: 'headingFontFamily',
              title: 'Overskrift CSS navn',
              type: 'string',
            }),
            defineField({
              name: 'bodyFontUrl',
              title: 'Brødtekst fil',
              type: 'string',
              components: {input: FontFileUploadInput},
            }),
            defineField({
              name: 'bodyFontFamily',
              title: 'Brødtekst CSS navn',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
})
