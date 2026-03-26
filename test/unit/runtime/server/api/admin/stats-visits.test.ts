import { describe, expect, it, vi } from 'vitest'

vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: () => ({}),
}))

const { buildPlausibleUrl } = await import('../../../../../../src/runtime/server/api/admin/stats-visits')

describe('stats-visits buildPlausibleUrl', () => {
  it('constructs a valid Plausible timeseries URL', () => {
    const url = buildPlausibleUrl('https://stats.mktco.de', 'example.com')
    expect(url).toBe(
      'https://stats.mktco.de/api/v1/stats/timeseries?site_id=example.com&period=30d&metrics=visitors',
    )
  })

  it('strips trailing slashes from the base URL', () => {
    const url = buildPlausibleUrl('https://stats.mktco.de/', 'example.com')
    expect(url).toBe(
      'https://stats.mktco.de/api/v1/stats/timeseries?site_id=example.com&period=30d&metrics=visitors',
    )
  })

  it('handles multiple trailing slashes', () => {
    const url = buildPlausibleUrl('https://stats.mktco.de///', 'my-site.org')
    expect(url).toBe(
      'https://stats.mktco.de/api/v1/stats/timeseries?site_id=my-site.org&period=30d&metrics=visitors',
    )
  })
})
