const MAX_STORED_IPS = 10_000
const MAX_IP_LENGTH = 64

let requestsTotal = 0
let uniqueIpsTotal = 0

const seenIps = new Map<string, true>()

export function incrementTrafficRequests() {
  requestsTotal += 1
}

export function trackUniqueIp(ip?: string) {
  if (!ip || ip.length > MAX_IP_LENGTH) {
    return
  }

  if (seenIps.has(ip)) {
    // Refresh insertion order to keep recently active IPs tracked.
    seenIps.delete(ip)
    seenIps.set(ip, true)
    return
  }

  if (seenIps.size >= MAX_STORED_IPS) {
    const oldestIp = seenIps.keys().next().value
    if (oldestIp) {
      seenIps.delete(oldestIp)
    }
  }

  seenIps.set(ip, true)
  uniqueIpsTotal += 1
}

export function resetTrafficMetrics() {
  requestsTotal = 0
  uniqueIpsTotal = 0
  seenIps.clear()
}

export function getTrafficMetrics() {
  return {
    requestsTotal,
    uniqueIpsTotal,
  }
}

export function getTrackedIpCount() {
  return seenIps.size
}
