import { createError, defineEventHandler, setHeader } from 'h3'
import { getStorageUsageBytes } from '../utils/storageUsage'

export default defineEventHandler(async (event) => {
  try {
    const storageUsageBytes = await getStorageUsageBytes()

    setHeader(event, 'Content-Type', 'text/plain; version=0.0.4; charset=utf-8')

    return [
      '# HELP mktcms_up Whether the mktcms API is healthy (1 = healthy).',
      '# TYPE mktcms_up gauge',
      'mktcms_up 1',
      '# HELP mktcms_storage_usage_bytes Current .storage directory size in bytes.',
      '# TYPE mktcms_storage_usage_bytes gauge',
      `mktcms_storage_usage_bytes ${storageUsageBytes}`,
    ].join('\n') + '\n'
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to build health metrics',
    })
  }
})
