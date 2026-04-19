import {writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

const DOWNLOADS_DIR = resolve('C:/Users/emilc/Downloads')

const ASSETS_TO_UPLOAD = [
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/allegade-10-video.mp4',
    type: 'file' as const,
    filename: 'allegade-10-video.mp4',
    contentType: 'video/mp4',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2026/02/DSC06352.jpg',
    type: 'image' as const,
    filename: 'DSC06352.jpg',
    contentType: 'image/jpeg',
  },
  // om-os page images
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/theater-menu.jpg',
    type: 'image' as const,
    filename: 'theater-menu.jpg',
    contentType: 'image/jpeg',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/grill.jpg',
    type: 'image' as const,
    filename: 'grill.jpg',
    contentType: 'image/jpeg',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/dinner.jpg',
    type: 'image' as const,
    filename: 'dinner.jpg',
    contentType: 'image/jpeg',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/frokost-menu.jpg',
    type: 'image' as const,
    filename: 'frokost-menu.jpg',
    contentType: 'image/jpeg',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/Oppe2klar.png',
    type: 'image' as const,
    filename: 'Oppe2klar.png',
    contentType: 'image/png',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/Keglebanen2.png',
    type: 'image' as const,
    filename: 'Keglebanen2.png',
    contentType: 'image/png',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/Stalden2.png',
    type: 'image' as const,
    filename: 'Stalden2.png',
    contentType: 'image/png',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/Smoky-Harvest-Apple-Cider-Margarita-1.jpg',
    type: 'image' as const,
    filename: 'Smoky-Harvest-Apple-Cider-Margarita-1.jpg',
    contentType: 'image/jpeg',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/middlebanner1.png',
    type: 'image' as const,
    filename: 'middlebanner1.png',
    contentType: 'image/png',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/passionfruit.webp',
    type: 'image' as const,
    filename: 'passionfruit.webp',
    contentType: 'image/webp',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/Baggard2klar.png',
    type: 'image' as const,
    filename: 'Baggard2klar.png',
    contentType: 'image/png',
  },
  {
    url: 'https://www.allegade10.dk/wp-content/uploads/2025/04/Stegt-flaesk2klar.png',
    type: 'image' as const,
    filename: 'Stegt-flaesk2klar.png',
    contentType: 'image/png',
  },
]

async function downloadAssets() {
  for (const asset of ASSETS_TO_UPLOAD) {
    console.log(`Downloading: ${asset.url}`)
    const response = await fetch(asset.url)
    if (!response.ok) {
      console.error(`  Failed to fetch: ${response.status}`)
      continue
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const dest = resolve(DOWNLOADS_DIR, asset.filename)
    writeFileSync(dest, buffer)
    console.log(`  Saved: ${dest} (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`)
  }
}

downloadAssets().catch(console.error)
