import { describe, expect, it } from 'vitest'

import { normalizeIp } from '../../../../../../src/runtime/server/api/traffic/track.post'

describe('track.post normalizeIp', () => {
  it('returns undefined for invalid or missing values', () => {
    expect(normalizeIp()).toBeUndefined()
    expect(normalizeIp(null)).toBeUndefined()
    expect(normalizeIp('')).toBeUndefined()
    expect(normalizeIp('not-an-ip')).toBeUndefined()
  })

  it('normalizes ipv4 and forwarded header format', () => {
    expect(normalizeIp(' 203.0.113.9 ')).toBe('203.0.113.9')
    expect(normalizeIp('203.0.113.9, 10.0.0.1')).toBe('203.0.113.9')
    expect(normalizeIp('::ffff:203.0.113.9')).toBe('203.0.113.9')
  })

  it('normalizes ipv6 casing and rejects oversized input', () => {
    expect(normalizeIp('2001:DB8::1')).toBe('2001:db8::1')
    expect(normalizeIp('1'.repeat(65))).toBeUndefined()
  })
})
