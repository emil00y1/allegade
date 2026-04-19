import {pageType} from './pageType'
import {reusableBlockType} from './reusableBlockType'
import {eventType} from './eventType'
import {eventsPageType} from './eventsPageType'
import {restaurantPageType} from './restaurantPageType'
import {menuPageType} from './menuPageType'
import {hotelPageType} from './hotelPageType'
import {hotelRoomType} from './hotelRoomType'
import {homepageType} from './homepageType'
import {jobPostingType} from './jobPostingType'
import {menuCardType} from './menuCardType'
import {selskaberPageType} from './selskaberPageType'
import {selskaberInquiryType} from './selskaberInquiryType'
import {siteSettingsType} from './siteSettingsType'
import {venueType} from './venueType'
import {redirectType} from './redirectType'
import {seoType} from './sections/seoType'
import {
  textImageSectionType,
  bannerSectionType,
  richTextSectionType,
  gallerySectionType,
  quoteSectionType,
  ctaBannerSectionType,
  faqSectionType,
  testimonialsSectionType,
  teamSectionType,
  offersSectionType,
  jobListingSectionType,
  reusableBlockReferenceSectionType,
  contactSectionType,
  hotelStorySectionType,
  hotelArrivalSectionType,
  hotelHeroSectionType,
  hotelFacilitiesSectionType,
  hotelRoomShowcaseSectionType,
  hotelPracticalInfoSectionType,
  hotelNeighborhoodSectionType,
  hotelRestaurantTeaserSectionType,
  restaurantHeroSectionType,
  restaurantStorySectionType,
  restaurantMenuTeaserSectionType,
  restaurantPhilosophySectionType,
  selskaberHeroSectionType,
  selskaberOccasionsSectionType,
  selskaberVenuesSectionType,
  selskaberMenuSectionType,
  selskaberCtaBannerSectionType,
  selskaberFormSectionType,
  selskaberTeaserSectionType,
  menuHeroSectionType,
  menuTabsSectionType,
  eventsHeroSectionType,
  eventsListSectionType,
  eventsArchiveSectionType,
  homeHeroSectionType,
  welcomeSectionType,
  eventsTeaserSectionType,
} from './sections'

export const schemaTypes = [
  // ── Singletons ────────────────────────────────────────────────────────────
  homepageType,
  eventsPageType,
  restaurantPageType,
  menuPageType,
  hotelPageType,
  selskaberPageType,
  siteSettingsType,

  // ── Content documents ─────────────────────────────────────────────────────
  pageType,
  reusableBlockType,
  eventType,
  venueType,
  hotelRoomType,
  jobPostingType,
  menuCardType,
  selskaberInquiryType,
  redirectType,

  // ── Object types ──────────────────────────────────────────────────────────
  seoType,

  // ── Generic sections ──────────────────────────────────────────────────────
  textImageSectionType,
  bannerSectionType,
  richTextSectionType,
  gallerySectionType,
  quoteSectionType,
  ctaBannerSectionType,
  faqSectionType,
  testimonialsSectionType,
  teamSectionType,
  offersSectionType,
  jobListingSectionType,
  reusableBlockReferenceSectionType,
  contactSectionType,

  // ── Home sections ─────────────────────────────────────────────────────────
  homeHeroSectionType,
  welcomeSectionType,
  eventsTeaserSectionType,
  selskaberTeaserSectionType,

  // ── Restaurant sections ───────────────────────────────────────────────────
  restaurantHeroSectionType,
  restaurantStorySectionType,
  restaurantMenuTeaserSectionType,
  restaurantPhilosophySectionType,

  // ── Hotel sections ────────────────────────────────────────────────────────
  hotelHeroSectionType,
  hotelFacilitiesSectionType,
  hotelRoomShowcaseSectionType,
  hotelPracticalInfoSectionType,
  hotelNeighborhoodSectionType,
  hotelRestaurantTeaserSectionType,
  hotelStorySectionType,
  hotelArrivalSectionType,

  // ── Selskaber sections ────────────────────────────────────────────────────
  selskaberHeroSectionType,
  selskaberOccasionsSectionType,
  selskaberVenuesSectionType,
  selskaberMenuSectionType,
  selskaberCtaBannerSectionType,
  selskaberFormSectionType,

  // ── Menu sections ─────────────────────────────────────────────────────────
  menuHeroSectionType,
  menuTabsSectionType,

  // ── Events sections ───────────────────────────────────────────────────────
  eventsHeroSectionType,
  eventsListSectionType,
  eventsArchiveSectionType,
]
