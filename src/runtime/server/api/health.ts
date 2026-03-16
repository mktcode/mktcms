import { createError, defineEventHandler, setHeader } from 'h3'
import { getStorageUsageBytes } from '../utils/storageUsage'
import { getTrafficMetrics } from '../utils/trafficMetrics'

export default defineEventHandler(async (event) => {
  try {
    const storageUsageBytes = await getStorageUsageBytes()
    const { requestsTotal, uniqueIpsTotal } = getTrafficMetrics()

    setHeader(event, 'Content-Type', 'text/plain; version=0.0.4; charset=utf-8')

    return [
      '# HELP mktcms_up Whether the mktcms API is healthy (1 = healthy).',
      '# TYPE mktcms_up gauge',
      'mktcms_up 1',
      '# HELP mktcms_storage_usage_bytes Current .storage directory size in bytes.',
      '# TYPE mktcms_storage_usage_bytes gauge',
      `mktcms_storage_usage_bytes ${storageUsageBytes}`,
      '# HELP mktcms_requests_total Total number of counted page requests.',
      '# TYPE mktcms_requests_total counter',
      `mktcms_requests_total ${requestsTotal}`,
      '# HELP mktcms_unique_ips_total Total number of unique visitor IPs seen in memory.',
      '# TYPE mktcms_unique_ips_total counter',
      `mktcms_unique_ips_total ${uniqueIpsTotal}`,
    ].join('\n') + '\n'
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to build health metrics',
    })
  }
})
