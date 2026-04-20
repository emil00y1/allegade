import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {resolve} from './presentation/resolve'
import {media} from 'sanity-plugin-media'
import {iconPicker} from 'sanity-plugin-icon-picker'
import {analyticsDashboard} from './plugins/analytics-dashboard'

// Document types that should only ever have one instance
const SINGLETONS = ['homepage', 'siteSettings', 'menuPage', 'hotelPage', 'selskaberPage', 'eventsPage', 'restaurantPage']
const HIDDEN_FROM_AUTO_LIST = [...SINGLETONS, 'page', 'selskaberInquiry', 'jobPosting', 'reusableBlock', 'redirect']

export default defineConfig({
  name: 'default',
  title: 'Allégade',

  projectId: 'b0bkhf04',
  dataset: 'production',

  plugins: [
    media(),
    iconPicker(),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Indhold')
          .items([
            // ─── Indstillinger ────────────────────────────────────────────
            S.listItem()
              .title('Forside')
              .id('homepage')
              .child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem()
              .title('Site indstillinger')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

            S.divider(),

            // ─── Hovidsider ───────────────────────────────────────────────
            S.listItem()
              .title('Restaurant')
              .id('restaurantPage')
              .child(S.document().schemaType('restaurantPage').documentId('restaurantPage')),
            S.listItem()
              .title('Menukort')
              .id('menuPage')
              .child(S.document().schemaType('menuPage').documentId('menuPage')),
            S.listItem()
              .title('Hotel')
              .id('hotelPage')
              .child(S.document().schemaType('hotelPage').documentId('hotelPage')),
            S.listItem()
              .title('Selskaber')
              .id('selskaberPage')
              .child(S.document().schemaType('selskaberPage').documentId('selskaberPage')),
            S.listItem()
              .title('Begivenheder')
              .id('eventsPage')
              .child(S.document().schemaType('eventsPage').documentId('eventsPage')),
            S.listItem()
              .title('Om Os')
              .id('page-om-os')
              .child(S.document().schemaType('page').documentId('page-om-os')),
            S.listItem()
              .title('Kontakt')
              .id('page-kontakt')
              .child(S.document().schemaType('page').documentId('page-kontakt')),

            S.divider(),

            // ─── Indhold ──────────────────────────────────────────────────
            S.listItem()
              .title('Jobopslag')
              .schemaType('jobPosting')
              .child(S.documentTypeList('jobPosting').title('Jobopslag')),
            S.listItem()
              .title('Selskabsforespørgsler')
              .schemaType('selskaberInquiry')
              .child(S.documentTypeList('selskaberInquiry').title('Forespørgsler')),

            S.divider(),

            // ─── Øvrige ───────────────────────────────────────────────────
            S.listItem()
              .title('Privatlivspolitik')
              .id('page-privatlivspolitik')
              .child(S.document().schemaType('page').documentId('page-privatlivspolitik')),
            S.listItem()
              .title('Øvrige sider')
              .schemaType('page')
              .child(S.documentTypeList('page').title('Øvrige sider')),
            S.listItem()
              .title('Genanvendelige blokke')
              .schemaType('reusableBlock')
              .child(S.documentTypeList('reusableBlock').title('Genanvendelige blokke')),

            S.divider(),

            // ─── Redirects ──────────────────────────────────────────────
            S.listItem()
              .title('Redirects')
              .schemaType('redirect')
              .child(S.documentTypeList('redirect').title('Redirects')),

            S.divider(),

            // ─── Auto (hotelRoom, menuCard, venue, event osv.) ────────────
            ...S.documentTypeListItems().filter(
              (item) => !HIDDEN_FROM_AUTO_LIST.includes(item.getId() ?? ''),
            ),
          ]),
    }),
    visionTool(),
    analyticsDashboard(),
    presentationTool({
      resolve,
      previewUrl: {
        origin:
          typeof location !== 'undefined' && location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://84jefjasalle3ad7udjgade82.vercel.app',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
