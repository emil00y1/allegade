import {useCallback, useEffect, useRef, useState} from 'react'
import type {AnalyticsRange, AnalyticsResponse} from '../types'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

interface UseAnalyticsResult {
  data: AnalyticsResponse | null
  error: string | null
  isLoading: boolean
  isRefreshing: boolean
  refetch: () => void
}

interface Env {
  apiUrl: string | undefined
  apiSecret: string | undefined
}

function readEnv(): Env {
  const env = (import.meta as unknown as {env?: Record<string, string | undefined>}).env ?? {}
  return {
    apiUrl: env.SANITY_STUDIO_ANALYTICS_API_URL,
    apiSecret: env.SANITY_STUDIO_ANALYTICS_API_SECRET,
  }
}

export function useAnalytics(range: AnalyticsRange): UseAnalyticsResult {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const abortRef = useRef<AbortController | null>(null)
  const lastFetchRef = useRef<number>(0)

  const run = useCallback(
    async (mode: 'initial' | 'refresh') => {
      const {apiUrl, apiSecret} = readEnv()
      if (!apiUrl || !apiSecret) {
        setError(
          'Missing SANITY_STUDIO_ANALYTICS_API_URL or SANITY_STUDIO_ANALYTICS_API_SECRET',
        )
        setIsLoading(false)
        return
      }

      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl

      if (mode === 'initial') setIsLoading(true)
      else setIsRefreshing(true)

      try {
        const url = `${apiUrl}?range=${encodeURIComponent(range)}`
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'omit',
          headers: {'x-api-key': apiSecret},
          signal: ctrl.signal,
        })

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | {error?: string}
            | null
          throw new Error(body?.error ?? `Request failed: ${res.status}`)
        }

        const json = (await res.json()) as AnalyticsResponse
        setData(json)
        setError(null)
        lastFetchRef.current = Date.now()
      } catch (err) {
        if ((err as {name?: string}).name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        if (mode === 'initial') setIsLoading(false)
        else setIsRefreshing(false)
      }
    },
    [range],
  )

  useEffect(() => {
    run('initial')
    return () => {
      abortRef.current?.abort()
    }
  }, [run])

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== 'visible') return
      run('refresh')
    }

    const interval = window.setInterval(tick, REFRESH_INTERVAL_MS)

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      const stale = Date.now() - lastFetchRef.current >= REFRESH_INTERVAL_MS
      if (stale) run('refresh')
    }

    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [run])

  const refetch = useCallback(() => {
    run('refresh')
  }, [run])

  return {data, error, isLoading, isRefreshing, refetch}
}
