const MAX_STORED_IPS = 10_000

let requestsTotal = 0
let uniqueIpsTotal = 0

const seenIps = new Set<string>()

export function incrementTrafficRequests() {
  requestsTotal += 1
}

export function trackUniqueIp(ip?: string) {
  if (!ip || seenIps.has(ip)) {
    return
  }

  if (seenIps.size >= MAX_STORED_IPS) {
    return
  }

  seenIps.add(ip)
  uniqueIpsTotal += 1
}

export function getTrafficMetrics() {
  return {
    requestsTotal,
    uniqueIpsTotal,
  }
}
