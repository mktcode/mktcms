import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams } from 'h3'
import { useStorage } from 'nitropack/runtime'

const paramsSchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))

  const storage = useStorage('content')
  const file = await storage.getItem(path)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return file
})
