export type AnalyticsRange = '7d' | '30d'

export interface AnalyticsTotals {
  sessions: number
  users: number
  pageviews: number
  avgSessionDurationSec: number
}

export interface DailyPoint {
  date: string
  sessions: number
  users: number
}

export interface TopPage {
  path: string
  title: string
  pageviews: number
  sessions: number
}

export interface TopQuery {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface SearchConsoleBlock {
  siteUrl: string
  windowDays: 28
  topQueries: TopQuery[]
}

export interface AnalyticsResponse {
  range: AnalyticsRange
  generatedAt: string
  timezone: string
  totals: AnalyticsTotals
  daily: DailyPoint[]
  topPages: TopPage[]
  searchConsole: SearchConsoleBlock
}

export interface AnalyticsErrorResponse {
  error: string
  code: 'unauthorized' | 'forbidden_origin' | 'upstream' | 'bad_request'
}
