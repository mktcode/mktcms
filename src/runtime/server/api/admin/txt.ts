import { z } from 'zod'
import { createError, defineEventHandler, getValidatedQuery } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const storage = useStorage('content')
  const file = await storage.getItemRaw(fullPath)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return file.toString('utf-8')
})
