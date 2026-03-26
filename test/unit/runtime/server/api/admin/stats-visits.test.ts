import { describe, expect, it, vi } from 'vitest'

vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: () => ({}),
}))

const {
  buildPlausibleUrl,
  buildPlausibleQuery,
  toDateString,
  buildFullDays,
} = await import('../../../../../../src/runtime/server/api/admin/stats-visits')

describe('buildPlausibleUrl', () => {
  it('constructs a v2 query URL', () => {
    expect(buildPlausibleUrl('https://stats.mktco.de')).toBe(
      'https://stats.mktco.de/api/v2/query',
    )
  })

  it('strips trailing slashes', () => {
    expect(buildPlausibleUrl('https://stats.mktco.de/')).toBe(
      'https://stats.mktco.de/api/v2/query',
    )
  })

  it('strips multiple trailing slashes', () => {
    expect(buildPlausibleUrl('https://stats.mktco.de///')).toBe(
      'https://stats.mktco.de/api/v2/query',
    )
  })
})

describe('buildPlausibleQuery', () => {
  it('returns a v2 query object with time:day dimension', () => {
    const q = buildPlausibleQuery('example.com', ['2026-02-25', '2026-03-26'])
    expect(q).toEqual({
      site_id: 'example.com',
      metrics: ['visitors'],
      date_range: ['2026-02-25', '2026-03-26'],
      dimensions: ['time:day'],
      include: { time_labels: true },
    })
  })
})

describe('toDateString', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('pads single-digit month and day', () => {
    expect(toDateString(new Date(2026, 2, 3))).toBe('2026-03-03')
  })
})

describe('buildFullDays', () => {
  const today = new Date(2026, 2, 26) // 2026-03-26

  it('returns 30 entries even when API results are empty', () => {
    const days = buildFullDays([], today)
    expect(days).toHaveLength(30)
    expect(days[0]!.date).toBe('2026-02-25')
    expect(days[29]!.date).toBe('2026-03-26')
    expect(days.every(d => d.visits === 0)).toBe(true)
  })

  it('fills known days from API data and defaults the rest to 0', () => {
    const apiResults = [
      { dimensions: ['2026-03-01'], metrics: [42] },
      { dimensions: ['2026-03-26'], metrics: [7] },
    ]
    const days = buildFullDays(apiResults, today)
    expect(days).toHaveLength(30)
    expect(days.find(d => d.date === '2026-03-01')!.visits).toBe(42)
    expect(days.find(d => d.date === '2026-03-26')!.visits).toBe(7)
    expect(days.find(d => d.date === '2026-02-25')!.visits).toBe(0)
  })

  it('always includes today as the last entry', () => {
    const days = buildFullDays([], today)
    expect(days[days.length - 1]!.date).toBe('2026-03-26')
  })
})
