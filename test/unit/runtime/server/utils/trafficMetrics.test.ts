import { beforeEach, describe, expect, it } from 'vitest'

import {
  getTrackedIpCount,
  getTrafficMetrics,
  incrementTrafficRequests,
  resetTrafficMetrics,
  trackUniqueIp,
} from '../../../../../src/runtime/server/utils/trafficMetrics'

describe('trafficMetrics', () => {
  beforeEach(() => {
    resetTrafficMetrics()
  })

  it('counts requests and unique ips', () => {
    incrementTrafficRequests()
    incrementTrafficRequests()

    trackUniqueIp('203.0.113.10')
    trackUniqueIp('203.0.113.10')
    trackUniqueIp('203.0.113.11')

    const metrics = getTrafficMetrics()
    expect(metrics.requestsTotal).toBe(2)
    expect(metrics.uniqueIpsTotal).toBe(2)
    expect(getTrackedIpCount()).toBe(2)
  })

  it('caps tracked ips to max size', () => {
    for (let i = 0; i < 10_050; i += 1) {
      const third = Math.floor(i / 250)
      const fourth = i % 250
      trackUniqueIp(`10.0.${third}.${fourth}`)
    }

    expect(getTrackedIpCount()).toBe(10_000)
  })

  it('ignores oversized values', () => {
    trackUniqueIp('1'.repeat(65))

    const metrics = getTrafficMetrics()
    expect(metrics.uniqueIpsTotal).toBe(0)
    expect(getTrackedIpCount()).toBe(0)
  })
})
