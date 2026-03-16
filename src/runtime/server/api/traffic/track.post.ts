import { defineEventHandler, getRequestIP } from 'h3'
import { incrementTrafficRequests, trackUniqueIp } from '../../utils/trafficMetrics'

function normalizeIp(ip?: string | null) {
  if (!ip) {
    return undefined
  }

  const normalizedIp = ip.trim()
  if (normalizedIp.startsWith('::ffff:')) {
    return normalizedIp.slice(7)
  }

  return normalizedIp
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
