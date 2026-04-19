import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: 'b0bkhf04',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

async function migrate() {
  console.log('Searching for hotelPage document...')
  const pages = await client.fetch('*[_type == "hotelPage"]')

  if (pages.length === 0) {
    console.error('Could not find any hotelPage documents')
    return
  }

  const page = pages[0]
  console.log(`Found document with ID: ${page._id}`)

  const sections = []
  const generateKey = () => Math.random().toString(36).substring(2, 11)

  // 1. Hero
  sections.push({
    _type: 'hotelHeroSection',
    _key: generateKey(),
    heroImage: page.heroImage,
    heroHeading: page.heroHeading,
    heroHeadingItalic: page.heroHeadingItalic,
    heroDescription: page.heroDescription,
    heroStats: page.heroStats,
    heroPrimaryCtaLabel: page.heroPrimaryCtaLabel,
    heroPrimaryCtaUrl: page.heroPrimaryCtaUrl,
    heroSecondaryCtaLabel: page.heroSecondaryCtaLabel,
    heroSecondaryCtaUrl: page.heroSecondaryCtaUrl,
    heroFloatingStarText: page.heroFloatingStarText,
    heroFloatingSubtext: page.heroFloatingSubtext,
    bookingCtaLabel: page.bookingCtaLabel,
    bookingCtaUrl: page.bookingCtaUrl,
  })

  // 2. Facilities
  sections.push({
    _type: 'hotelFacilitiesSection',
    _key: generateKey(),
    facilitiesHeading: page.facilitiesHeading,
    facilitiesHeadingItalic: page.facilitiesHeadingItalic,
    facilitiesDescription: page.facilitiesDescription,
    facilities: page.facilities,
  })

  // 3. Room Showcase
  sections.push({
    _type: 'hotelRoomShowcaseSection',
    _key: generateKey(),
    roomShowcaseHeading: page.roomShowcaseHeading,
  })

  // 4. Practical Info
  sections.push({
    _type: 'hotelPracticalInfoSection',
    _key: generateKey(),
    practicalInfoHeading: page.practicalInfoHeading,
    practicalInfoHeadingItalic: page.practicalInfoHeadingItalic,
    faqItems: page.faqItems,
  })

  // 5. Neighborhood
  sections.push({
    _type: 'hotelNeighborhoodSection',
    _key: generateKey(),
    neighborhoodHeading: page.neighborhoodHeading,
    neighborhoodHeadingItalic: page.neighborhoodHeadingItalic,
    neighborhoodAddress: page.neighborhoodAddress,
    neighborhoodCity: page.neighborhoodCity,
    neighborhoodMapUrl: page.neighborhoodMapUrl,
    neighborhoodItems: page.neighborhoodItems,
    mapEyebrow: page.mapEyebrow,
    directionsLabel: page.directionsLabel,
  })

  // 6. Restaurant Teaser
  sections.push({
    _type: 'hotelRestaurantTeaserSection',
    _key: generateKey(),
    restaurantEyebrow: page.restaurantEyebrow,
    restaurantHeading: page.restaurantHeading,
    restaurantHeadingItalic: page.restaurantHeadingItalic,
    restaurantDescription: page.restaurantDescription,
    restaurantCtaLabel: page.restaurantCtaLabel,
    restaurantCtaUrl: page.restaurantCtaUrl,
    restaurantImage: page.restaurantImage,
  })

  // Append existing extra sections if any
  if (page.sections && Array.isArray(page.sections)) {
    page.sections.forEach(s => {
      const types = [
        'hotelHeroSection', 'hotelFacilitiesSection', 'hotelRoomShowcaseSection',
        'hotelPracticalInfoSection', 'hotelNeighborhoodSection', 'hotelRestaurantTeaserSection'
      ]
      if (!types.includes(s._type)) {
        sections.push(s)
      }
    })
  }

  console.log(`Prepared ${sections.length} sections. Updating document...`)

  const unsetFields = [
    'heroImage', 'heroHeading', 'heroHeadingItalic', 'heroDescription', 'heroStats',
    'heroPrimaryCtaLabel', 'heroPrimaryCtaUrl', 'heroSecondaryCtaLabel', 'heroSecondaryCtaUrl',
    'heroFloatingStarText', 'heroFloatingSubtext', 'bookingCtaLabel', 'bookingCtaUrl',
    'facilitiesHeading', 'facilitiesHeadingItalic', 'facilitiesDescription', 'facilities',
    'roomShowcaseHeading', 'practicalInfoHeading', 'practicalInfoHeadingItalic', 'faqItems',
    'neighborhoodHeading', 'neighborhoodHeadingItalic', 'neighborhoodAddress', 'neighborhoodCity',
    'neighborhoodMapUrl', 'neighborhoodItems', 'mapEyebrow', 'directionsLabel',
    'restaurantEyebrow', 'restaurantHeading', 'restaurantHeadingItalic', 'restaurantDescription',
    'restaurantCtaLabel', 'restaurantCtaUrl', 'restaurantImage'
  ]

  await client
    .patch(page._id)
    .set({ sections })
    .unset(unsetFields)
    .commit()

  console.log('Migration completed successfully!')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
