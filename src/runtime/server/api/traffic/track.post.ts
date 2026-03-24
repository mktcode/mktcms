import { defineEventHandler, getRequestIP } from 'h3'
import { isIP } from 'node:net'
import { incrementTrafficRequests, trackUniqueIp } from '../../utils/trafficMetrics'

export function normalizeIp(ip?: string | null) {
  if (!ip) {
    return undefined
  }

  const candidate = ip
    .split(',')[0]
    ?.trim()

  if (!candidate) {
    return undefined
  }

  let normalizedIp = candidate
  if (normalizedIp.startsWith('::ffff:')) {
    normalizedIp = normalizedIp.slice(7)
  }

  // Protect metrics memory from oversized header values.
  if (normalizedIp.length > 64) {
    return undefined
  }

  if (isIP(normalizedIp) === 0) {
    return undefined
  }

  return normalizedIp.toLowerCase()
}

export default defineEventHandler((event) => {
  const userAgent = event.node.req.headers['user-agent']
  if (typeof userAgent === 'string' && userAgent.includes('Blackbox')) {
    return { tracked: false }
  }

  incrementTrafficRequests()

  const requestIp = normalizeIp(getRequestIP(event, { xForwardedFor: true }) || event.node.req.socket.remoteAddress)
  trackUniqueIp(requestIp)

  return { tracked: true }
})
