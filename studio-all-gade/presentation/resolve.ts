import {defineLocations} from 'sanity/presentation'
import type {PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homepage: defineLocations({
      resolve: () => ({
        locations: [{title: 'Forside', href: '/'}],
      }),
    }),
    hotelPage: defineLocations({
      resolve: () => ({
        locations: [{title: 'Hotel', href: '/hotel'}],
      }),
    }),
    hotelRoom: defineLocations({
      resolve: () => ({
        locations: [{title: 'Hotel', href: '/hotel'}],
      }),
    }),
    restaurantPage: defineLocations({
      resolve: () => ({
        locations: [{title: 'Restaurant', href: '/restaurant'}],
      }),
    }),
    menuPage: defineLocations({
      resolve: () => ({
        locations: [{title: 'Menukort', href: '/menukort'}],
      }),
    }),
    menuCard: defineLocations({
      resolve: () => ({
        locations: [{title: 'Menukort', href: '/menukort'}],
      }),
    }),
    eventsPage: defineLocations({
      resolve: () => ({
        locations: [{title: 'Begivenheder', href: '/begivenheder'}],
      }),
    }),
    event: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title ?? 'Untitled', href: `/events/${doc?.slug}`},
          {title: 'Begivenheder', href: '/begivenheder'},
        ],
      }),
    }),
    selskaberPage: defineLocations({
      resolve: () => ({
        locations: [{title: 'Selskaber', href: '/selskaber'}],
      }),
    }),
    venue: defineLocations({
      resolve: () => ({
        locations: [{title: 'Selskaber', href: '/selskaber'}],
      }),
    }),
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title ?? 'Unavngivet side', href: `/${doc?.slug}`},
        ],
      }),
    }),
    jobPosting: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title ?? 'Jobopslag', href: `/karriere/${doc?.slug}`},
          {title: 'Karriere', href: '/karriere'},
        ],
      }),
    }),
    siteSettings: defineLocations({
      resolve: () => ({
        locations: [
          {title: 'Forside', href: '/'},
          {title: 'Restaurant', href: '/restaurant'},
          {title: 'Menukort', href: '/menukort'},
          {title: 'Hotel', href: '/hotel'},
          {title: 'Selskaber', href: '/selskaber'},
          {title: 'Begivenheder', href: '/begivenheder'},
        ],
      }),
    }),
  },
}
