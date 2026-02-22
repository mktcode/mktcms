import { createError, defineEventHandler } from 'h3'
import { getCounterpartBranch, getCurrentBranchName, isSupportedWebsiteBranch } from '../../utils/gitVersioning'

export default defineEventHandler(async () => {
  try {
    const currentBranch = await getCurrentBranchName()
    const isSupported = isSupportedWebsiteBranch(currentBranch)

    if (!isSupported) {
      return {
        currentBranch,
        isSupported,
        sourceBranch: null,
        targetBranch: null,
      }
    }

    return {
      currentBranch,
      isSupported,
      sourceBranch: getCounterpartBranch(currentBranch),
      targetBranch: currentBranch,
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to get current Git branch',
    })
  }
})
