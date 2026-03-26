import { defineEventHandler, createError } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

type VisitDay = {
  date: string
  visits: number
}

type PlausibleTimeseriesResult = {
  date: string
  visitors: number
}

type PlausibleTimeseriesResponse = {
  results: PlausibleTimeseriesResult[]
}

export function buildPlausibleUrl(apiUrl: string, siteId: string): string {
  const base = apiUrl.replace(/\/+$/, '')
  const params = new URLSearchParams({
    site_id: siteId,
    period: '30d',
    metrics: 'visitors',
  })
  return `${base}/api/v1/stats/timeseries?${params.toString()}`
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const plausibleApiHost = config.public.plausibleApiHost
  const plausibleApiKey = config.plausibleApiKey
  const siteUrl = config.public.mktcms.siteUrl

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

  const url = buildPlausibleUrl(plausibleApiHost, siteId)

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${plausibleApiKey}`,
    },
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

  const body = await response.json() as PlausibleTimeseriesResponse

  const days: VisitDay[] = (body.results ?? []).map(r => ({
    date: r.date,
    visits: r.visitors,
  }))

  return {
    rangeDays: 30,
    days,
  }
})
