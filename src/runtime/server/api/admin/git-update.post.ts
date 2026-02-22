import { createError, defineEventHandler } from 'h3'
import { mergeCounterpartBranchIntoCurrent } from '../../utils/gitVersioning'

function toStatusCode(message: string) {
  if (/Unsupported checked-out branch/i.test(message)) {
    return 400
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
    const result = await mergeCounterpartBranchIntoCurrent()

    return {
      success: true,
      sourceBranch: result.sourceBranch,
      targetBranch: result.targetBranch,
    }
  }
  catch (error: any) {
    const message = error?.message || 'Failed to update branch'

    throw createError({
      statusCode: toStatusCode(message),
      statusMessage: message,
    })
  }
})
