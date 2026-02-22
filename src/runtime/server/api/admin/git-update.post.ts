import { createError, defineEventHandler } from 'h3'
import { isVersioningEnabled, mergeCounterpartBranchIntoCurrent } from '../../utils/gitVersioning'

function toStatusCode(message: string) {
  if (/Versioning feature is disabled/i.test(message)) {
    return 404
  }

  if (/Unsupported checked-out branch/i.test(message)) {
    return 400
  }

  if (/Counterpart branch not found/i.test(message)) {
    return 409
  }

  if (/working tree has uncommitted changes/i.test(message)) {
    return 409
  }

  if (/merge conflicts/i.test(message)) {
    return 409
  }

  return 500
}

export default defineEventHandler(async () => {
  try {
    if (!isVersioningEnabled()) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Versioning feature is disabled',
      })
    }

    const result = await mergeCounterpartBranchIntoCurrent()

    return {
      success: true,
      sourceBranch: result.sourceBranch,
      targetBranch: result.targetBranch,
    }
  }
  catch (error: any) {
    if (error?.statusCode && error?.statusMessage) {
      throw error
    }

    const message = error?.message || 'Failed to update branch'

    throw createError({
      statusCode: toStatusCode(message),
      statusMessage: message,
    })
  }
})
