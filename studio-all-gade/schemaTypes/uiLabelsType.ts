import {defineField, defineType} from 'sanity'
import {TranslateIcon} from '@sanity/icons'

/**
 * Singleton holding static UI microcopy that is not tied to a single page
 * (career listings, room/event detail labels, form copy, etc.). Danish is the
 * source; the build-time translation script generates the other languages, so
 * everything here is fully covered by the localization pipeline.
 *
 * All fields have Danish initialValues so the live site keeps its current copy.
 */
export const uiLabelsType = defineType({
  name: 'uiLabels',
  title: 'UI tekster',
  type: 'document',
  icon: TranslateIcon,
  groups: [
    {name: 'general', title: 'Generelt'},
    {name: 'hotel', title: 'Hotel / Værelser'},
    {name: 'events', title: 'Begivenheder'},
    {name: 'careers', title: 'Karriere'},
    {name: 'misc', title: 'Diverse'},
  ],
  fields: [
    // ── General ────────────────────────────────────────────────────────────
    defineField({name: 'priceOnRequest', title: 'Pris på forespørgsel', type: 'string', group: 'general', initialValue: 'Kontakt os for pris'}),
    defineField({name: 'free', title: 'Gratis', type: 'string', group: 'general', initialValue: 'Gratis'}),
    defineField({name: 'currencySuffix', title: 'Valuta-suffiks (f.eks. "kr.")', type: 'string', group: 'general', initialValue: 'kr.'}),
    defineField({name: 'readMore', title: 'Læs mere', type: 'string', group: 'general', initialValue: 'Læs mere'}),

    // ── Hotel / rooms ──────────────────────────────────────────────────────
    defineField({name: 'roomsBreadcrumbHotel', title: 'Brødkrumme: Hotel', type: 'string', group: 'hotel', initialValue: 'Hotel'}),
    defineField({name: 'roomsBreadcrumbAll', title: 'Brødkrumme: Alle værelser', type: 'string', group: 'hotel', initialValue: 'Alle værelser'}),
    defineField({name: 'roomPricePerNight', title: 'Pris pr. nat (label)', type: 'string', group: 'hotel', initialValue: 'Pris pr. nat'}),
    defineField({name: 'roomBookStay', title: 'Book ophold (knap)', type: 'string', group: 'hotel', initialValue: 'Book ophold'}),
    defineField({name: 'roomSeeAll', title: 'Se alle værelser', type: 'string', group: 'hotel', initialValue: 'Se alle værelser'}),
    defineField({name: 'roomFacilities', title: 'Faciliteter (overskrift)', type: 'string', group: 'hotel', initialValue: 'Faciliteter'}),
    defineField({name: 'roomBookYourStay', title: 'Book dit ophold (eyebrow)', type: 'string', group: 'hotel', initialValue: 'Book dit ophold'}),
    defineField({name: 'roomReadyToBook', title: 'Klar til at booke (før værelsesnavn)', type: 'string', group: 'hotel', initialValue: 'Klar til at booke'}),

    // ── Events ─────────────────────────────────────────────────────────────
    defineField({name: 'eventsBreadcrumb', title: 'Brødkrumme: Begivenheder', type: 'string', group: 'events', initialValue: 'Begivenheder'}),
    defineField({name: 'eventMenuHeading', title: 'Menu (overskrift)', type: 'string', group: 'events', initialValue: 'Menu'}),
    defineField({name: 'eventPracticalInfo', title: 'Praktisk info (overskrift)', type: 'string', group: 'events', initialValue: 'Praktisk info'}),
    defineField({name: 'eventCapacityPrefix', title: 'Kapacitet: præfiks (f.eks. "Op til")', type: 'string', group: 'events', initialValue: 'Op til'}),
    defineField({name: 'eventCapacitySuffix', title: 'Kapacitet: suffiks (f.eks. "gæster")', type: 'string', group: 'events', initialValue: 'gæster'}),
    defineField({name: 'eventPriceHeading', title: 'Pris (overskrift)', type: 'string', group: 'events', initialValue: 'Pris'}),
    defineField({name: 'eventBookSpot', title: 'Book plads (knap)', type: 'string', group: 'events', initialValue: 'Book plads'}),
    defineField({name: 'eventAllEvents', title: 'Alle begivenheder (tilbage-link)', type: 'string', group: 'events', initialValue: 'Alle begivenheder'}),

    // ── Careers ────────────────────────────────────────────────────────────
    defineField({name: 'careersTitle', title: 'Karriere (sidetitel)', type: 'string', group: 'careers', initialValue: 'Karriere'}),
    defineField({name: 'careersEmpty', title: 'Ingen stillinger (tom tilstand)', type: 'text', rows: 2, group: 'careers', initialValue: 'Vi har ingen ledige stillinger lige nu. Kig forbi igen snart.'}),
    defineField({name: 'careersDeadlinePrefix', title: 'Frist-præfiks', type: 'string', group: 'careers', initialValue: 'Frist:'}),
    defineField({name: 'careersFullTime', title: 'Fuldtid', type: 'string', group: 'careers', initialValue: 'Fuldtid'}),
    defineField({name: 'careersPartTime', title: 'Deltid', type: 'string', group: 'careers', initialValue: 'Deltid'}),
    defineField({name: 'careersApplyNow', title: 'Ansøg nu (knap)', type: 'string', group: 'careers', initialValue: 'Ansøg nu'}),
    defineField({name: 'careersAllPositions', title: 'Alle stillinger (tilbage-link)', type: 'string', group: 'careers', initialValue: 'Alle stillinger'}),

    // ── Misc shared components ─────────────────────────────────────────────
    defineField({name: 'venueInquire', title: 'Forespørg om lokalet (knap)', type: 'string', group: 'misc', initialValue: 'Forespørg om lokalet'}),
    defineField({name: 'venueNext', title: 'Næste lokale (a11y)', type: 'string', group: 'misc', initialValue: 'Næste lokale'}),
    defineField({name: 'menuSeeDrinks', title: 'Se drikkekort', type: 'string', group: 'misc', initialValue: 'Se drikkekort'}),
    defineField({name: 'menuEmpty', title: 'Menu tom tilstand', type: 'text', rows: 2, group: 'misc', initialValue: 'Indholdet er ikke klar endnu — tilføj et menukort i Sanity Studio.'}),
    defineField({name: 'mapTitle', title: 'Kort: titel/alt', type: 'string', group: 'misc', initialValue: 'Kort over Allégade 10'}),
    defineField({name: 'mapRecenter', title: 'Kort: centrér', type: 'string', group: 'misc', initialValue: 'Centrér kort'}),
  ],
  preview: {
    prepare: () => ({title: 'UI tekster'}),
  },
})
