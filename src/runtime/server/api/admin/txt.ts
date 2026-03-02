import { z } from 'zod'
import { createError, defineEventHandler, getValidatedQuery } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { normalizeContentKey } from '../../utils/contentKey'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentKey = normalizeContentKey(path)

  const storage = useStorage('content')
  const file = await storage.getItem<string>(contentKey)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return file
})
