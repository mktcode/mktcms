import { createError, defineEventHandler } from 'h3'
import { getBranchUpdateStatus, isVersioningEnabled, toGitErrorMessage } from '../../utils/gitVersioning'

export default defineEventHandler(async () => {
  try {
    if (!isVersioningEnabled()) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Versioning feature is disabled',
      })
    }

    return await getBranchUpdateStatus()
  }
  catch (error: any) {
    if (error?.statusCode && error?.statusMessage) {
      throw error
    }

    const safeMessage = toGitErrorMessage(error, 'Failed to get Git update status')

    throw createError({
      statusCode: 500,
      statusMessage: safeMessage,
    })
  }
})
