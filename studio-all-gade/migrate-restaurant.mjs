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
  console.log('Fetching restaurantPage document...')
  const page = await client.getDocument('restaurantPage')

  if (!page) {
    console.error('Could not find restaurantPage document')
    return
  }

  const sections = []
  const generateKey = () => Math.random().toString(36).substring(2, 11)

  // 1. Hero
  console.log('Migrating Hero...')
  sections.push({
    _type: 'restaurantHeroSection',
    _key: generateKey(),
    heroImage: page.heroImage,
    heroHeading: page.heroHeading,
    heroHeadingItalic: page.heroHeadingItalic,
    heroDescription: page.heroDescription,
    heroBookCtaLabel: page.heroBookCtaLabel,
    heroBookCtaUrl: page.heroBookCtaUrl,
    heroMenuCtaLabel: page.heroMenuCtaLabel,
    heroMenuCtaUrl: page.heroMenuCtaUrl,
  })

  // 2. Story
  console.log('Migrating Story...')
  sections.push({
    _type: 'restaurantStorySection',
    _key: generateKey(),
    storyImage: page.storyImage,
    storyEyebrow: page.storyEyebrow,
    storyHeading: page.storyHeading,
    storyBody: page.storyBody,
    storyStats: page.storyStats,
  })

  // 3. Menu Teaser
  console.log('Migrating Menu Teaser...')
  sections.push({
    _type: 'restaurantMenuTeaserSection',
    _key: generateKey(),
    menuTeaserEyebrow: page.menuTeaserEyebrow,
    menuTeaserHeading: page.menuTeaserHeading,
    menuTeaserDescription: page.menuTeaserDescription,
    menuServices: page.menuServices,
    menuCtaLabel: page.menuCtaLabel,
    menuCtaUrl: page.menuCtaUrl,
  })

  // 4. Philosophy
  console.log('Migrating Philosophy...')
  sections.push({
    _type: 'restaurantPhilosophySection',
    _key: generateKey(),
    philosophyImage: page.philosophyImage,
    philosophyQuote: page.philosophyQuote,
    philosophyAttribution: page.philosophyAttribution,
  })

  // 5. Gallery
  console.log('Migrating Gallery...')
  sections.push({
    _type: 'gallerySection',
    _key: generateKey(),
    heading: page.galleryHeading,
    images: page.galleryImages,
  })

  // Append existing extra sections if any
  if (page.sections && Array.isArray(page.sections)) {
    console.log('Preserving existing extra sections...')
    page.sections.forEach(s => {
      const types = [
        'restaurantHeroSection', 'restaurantStorySection', 'restaurantMenuTeaserSection',
        'restaurantPhilosophySection', 'gallerySection'
      ]
      if (!types.includes(s._type)) {
        sections.push(s)
      }
    })
  }

  console.log(`Prepared ${sections.length} sections. Updating document...`)

  const unsetFields = [
    'heroImage', 'heroHeading', 'heroHeadingItalic', 'heroDescription', 
    'heroBookCtaLabel', 'heroBookCtaUrl', 'heroMenuCtaLabel', 'heroMenuCtaUrl',
    'storyImage', 'storyEyebrow', 'storyHeading', 'storyBody', 'storyStats',
    'menuTeaserEyebrow', 'menuTeaserHeading', 'menuTeaserDescription', 'menuServices', 
    'menuCtaLabel', 'menuCtaUrl',
    'philosophyImage', 'philosophyQuote', 'philosophyAttribution',
    'galleryHeading', 'galleryImages'
  ]

  await client
    .patch('restaurantPage')
    .set({ sections })
    .unset(unsetFields)
    .commit()

  console.log('Migration completed successfully!')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
