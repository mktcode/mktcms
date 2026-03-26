import { defineEventHandler, createError } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

type VisitDay = {
  date: string
  visits: number
}

type TopPage = {
  path: string
  visits: number
}

type PlausibleV2Result = {
  dimensions: string[]
  metrics: number[]
}

type PlausibleV2Response = {
  results: PlausibleV2Result[]
}

type PlausibleV2Query = {
  site_id: string
  metrics: string[]
  date_range: [string, string]
  dimensions: string[]
  include?: {
    time_labels?: boolean
  }
  order_by?: [string, 'asc' | 'desc'][]
  pagination?: {
    limit: number
    offset: number
  }
}

const RANGE_DAYS = 30

export function buildPlausibleUrl(apiUrl: string): string {
  return `${apiUrl.replace(/\/+$/, '')}/api/v2/query`
}

export function buildDailyVisitorsQuery(siteId: string, dateRange: [string, string]): PlausibleV2Query {
  return {
    site_id: siteId,
    metrics: ['visitors'],
    date_range: dateRange,
    dimensions: ['time:day'],
    include: { time_labels: true },
  }
}

export function buildTopPagesQuery(siteId: string, dateRange: [string, string]): PlausibleV2Query {
  return {
    site_id: siteId,
    metrics: ['visitors'],
    date_range: dateRange,
    dimensions: ['event:page'],
    order_by: [['visitors', 'desc']],
    pagination: {
      limit: 10,
      offset: 0,
    },
  }
}

/** ISO date string (YYYY-MM-DD) for a Date in local time. */
export function toDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Build a full RANGE_DAYS-length array from (today − 29 days) to today,
 * filling in visitor counts from the API data and defaulting to 0.
 */
export function buildFullDays(apiResults: PlausibleV2Result[], today: Date): VisitDay[] {
  const lookup = new Map<string, number>()
  for (const row of apiResults) {
    const date = row.dimensions[0]
    const visitors = row.metrics[0]
    if (date && typeof visitors === 'number' && Number.isFinite(visitors)) {
      lookup.set(date, visitors)
    }
  }

  const days: VisitDay[] = []
  for (let i = RANGE_DAYS - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const date = toDateString(d)
    days.push({ date, visits: lookup.get(date) ?? 0 })
  }
  return days
}

export function buildTopPages(apiResults: PlausibleV2Result[]): TopPage[] {
  return apiResults.flatMap((row) => {
    const path = row.dimensions[0]
    const visitors = row.metrics[0]

    if (!path || typeof visitors !== 'number' || !Number.isFinite(visitors)) {
      return []
    }

    return [{
      path,
      visits: visitors,
    }]
  })
}

async function fetchPlausibleQuery(url: string, apiKey: string, query: PlausibleV2Query): Promise<PlausibleV2Response> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  }).catch((err: Error) => {
    throw createError({
      statusCode: 502,
      statusMessage: `Failed to reach Plausible API: ${err.message}`,
    })
  })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `Plausible API returned ${response.status}.`,
    })
  }

  return await response.json() as PlausibleV2Response
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const plausibleApiHost = config.public.plausibleApiHost as string | undefined
  const plausibleApiKey = config.plausibleApiKey as string | undefined
  const siteUrl = config.public.mktcms.siteUrl as string | undefined

  if (!plausibleApiHost || !plausibleApiKey || !siteUrl) {
    const missing = [
      !plausibleApiHost && 'NUXT_PUBLIC_PLAUSIBLE_API_HOST',
      !plausibleApiKey && 'NUXT_PLAUSIBLE_API_KEY',
      !siteUrl && 'NUXT_PUBLIC_MKTCMS_SITE_URL',
    ].filter(Boolean).join(', ')
    throw createError({
      statusCode: 503,
      statusMessage: `Plausible analytics is not configured. Missing: ${missing}`,
    })
  }

  let siteId: string
  try {
    siteId = new URL(siteUrl).hostname
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid siteUrl configured.',
    })
  }

  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - (RANGE_DAYS - 1))
  const dateRange: [string, string] = [toDateString(start), toDateString(today)]

  const url = buildPlausibleUrl(plausibleApiHost)
  const [dailyBody, topPagesBody] = await Promise.all([
    fetchPlausibleQuery(url, plausibleApiKey, buildDailyVisitorsQuery(siteId, dateRange)),
    fetchPlausibleQuery(url, plausibleApiKey, buildTopPagesQuery(siteId, dateRange)),
  ])

  return {
    rangeDays: RANGE_DAYS,
    days: buildFullDays(dailyBody.results ?? [], today),
    topPages: buildTopPages(topPagesBody.results ?? []),
  }
})
