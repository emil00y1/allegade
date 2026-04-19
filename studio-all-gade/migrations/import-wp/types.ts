import type {
  WP_REST_API_Categories,
  WP_REST_API_Pages,
  WP_REST_API_Posts,
  WP_REST_API_Tags,
  WP_REST_API_Users,
} from 'wp-types'

export type WordPressDataType = 'categories' | 'posts' | 'pages' | 'tags' | 'users' | 'media'

export type WordPressDataTypeResponses = {
  categories: WP_REST_API_Categories
  posts: WP_REST_API_Posts
  pages: WP_REST_API_Pages
  tags: WP_REST_API_Tags
  users: WP_REST_API_Users
  media: WP_REST_API_Media[]
}

export type SanitySchemaType = 'post' | 'event' | 'venue' | 'hotelRoom' | 'jobPosting' | 'menuCard' | 'siteSettings'

export interface WP_REST_API_Media {
  id: number
  source_url: string
  alt_text: string
  title: {rendered: string}
  media_type: string
  mime_type: string
}

/** Pages classified by their target Sanity document type */
export interface PageClassification {
  type: SanitySchemaType
  wpPage: any
}
