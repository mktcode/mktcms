import { z } from 'zod'
import { createError, defineEventHandler, getValidatedQuery } from 'h3'
import { getGitHistoryPage, isVersioningEnabled, toGitErrorMessage } from '../../utils/gitVersioning'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25),
})

export default defineEventHandler(async (event) => {
  try {
    if (!isVersioningEnabled()) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Versioning feature is disabled',
      })
    }

    const { page, perPage } = await getValidatedQuery(event, query => querySchema.parse(query))

    return await getGitHistoryPage(page, perPage)
  }
  catch (error: any) {
    if (error?.statusCode && error?.statusMessage) {
      throw error
    }

    const safeMessage = toGitErrorMessage(error, 'Failed to load Git history')

    throw createError({
      statusCode: 500,
      statusMessage: safeMessage,
    })
  }
})
