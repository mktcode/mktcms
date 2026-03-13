import { createError, defineEventHandler } from 'h3'
import { getStorageUsageBytes } from '../../utils/storageUsage'

export default defineEventHandler(async () => {
  try {
    const bytes = await getStorageUsageBytes()
    return { bytes }
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to calculate storage usage',
    })
  }
})
