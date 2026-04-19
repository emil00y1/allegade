import { createClient } from '@sanity/client'
import 'dotenv/config'
import { randomKey } from '@sanity/util/content'

const client = createClient({
  projectId: 'b0bkhf04',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

const generateSections = (types) => types.map(type => ({
  _type: type,
  _key: randomKey(12)
}))

const SINGLETONS = [
  { 
    id: 'homepage', 
    type: 'homepage', 
    title: 'Forside',
    sections: generateSections(['homeHeroSection', 'welcomeSection', 'eventsTeaserSection', 'selskaberTeaserSection'])
  },
  { 
    id: 'siteSettings', 
    type: 'siteSettings', 
    title: 'Site Indstillinger' 
  },
  { 
    id: 'restaurantPage', 
    type: 'restaurantPage', 
    title: 'Restaurant Side',
    sections: generateSections(['restaurantHeroSection', 'restaurantStorySection', 'restaurantMenuTeaserSection', 'restaurantPhilosophySection', 'gallerySection'])
  },
  { 
    id: 'menuPage', 
    type: 'menuPage', 
    title: 'Menukort Side',
    sections: generateSections(['menuHeroSection', 'menuTabsSection'])
  },
  { 
    id: 'hotelPage', 
    type: 'hotelPage', 
    title: 'Hotel Side',
    sections: generateSections(['hotelHeroSection', 'hotelFacilitiesSection', 'hotelRoomShowcaseSection', 'hotelPracticalInfoSection', 'hotelNeighborhoodSection', 'hotelRestaurantTeaserSection'])
  },
  { 
    id: 'selskaberPage', 
    type: 'selskaberPage', 
    title: 'Selskaber Side',
    sections: generateSections(['selskaberHeroSection', 'selskaberOccasionsSection', 'selskaberVenuesSection', 'selskaberMenuSection', 'selskaberCtaBannerSection', 'selskaberFormSection'])
  },
  { 
    id: 'eventsPage', 
    type: 'eventsPage', 
    title: 'Begivenheder Side' 
  },
]

async function seed() {
  console.log('Starting to seed singleton documents...')

  for (const singleton of SINGLETONS) {
    console.log(`Checking ${singleton.id}...`)
    const existing = await client.getDocument(singleton.id)

    if (!existing) {
      console.log(`Document ${singleton.id} missing. Creating with defaults...`)
      const doc = {
        _id: singleton.id,
        _type: singleton.type,
        title: singleton.title,
      }
      
      if (singleton.sections) {
        doc.sections = singleton.sections
      }

      await client.create(doc)
      console.log(`Created ${singleton.id}`)
    } else {
      console.log(`Document ${singleton.id} already exists. Skipping.`)
    }
  }

  console.log('Seeding completed!')
}

seed().catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
