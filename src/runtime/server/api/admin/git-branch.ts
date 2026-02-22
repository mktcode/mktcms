import { createError, defineEventHandler } from 'h3'
import { getCounterpartBranch, getCurrentBranchName, hasRemoteBranch, isSupportedWebsiteBranch, isVersioningEnabled } from '../../utils/gitVersioning'

export default defineEventHandler(async () => {
  try {
    if (!isVersioningEnabled()) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Versioning feature is disabled',
      })
    }

    const currentBranch = await getCurrentBranchName()
    const isSupported = isSupportedWebsiteBranch(currentBranch)

    if (!isSupported) {
      return {
        currentBranch,
        isSupported,
        sourceBranch: null,
        targetBranch: null,
        hasCounterpartBranch: false,
        canUpdate: false,
        updateBlockedReason: 'Unsupported checked-out branch. Expected main or staging.',
      }
    }

    const sourceBranch = getCounterpartBranch(currentBranch)
    const hasCounterpartBranch = await hasRemoteBranch(sourceBranch)

    return {
      currentBranch,
      isSupported,
      sourceBranch,
      targetBranch: currentBranch,
      hasCounterpartBranch,
      canUpdate: hasCounterpartBranch,
      updateBlockedReason: hasCounterpartBranch ? null : `Counterpart branch not found: ${sourceBranch}`,
    }
  }
  catch (error: any) {
    if (error?.statusCode && error?.statusMessage) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to get current Git branch',
    })
  }
})
