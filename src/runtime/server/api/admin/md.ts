import { z } from 'zod'
import { createError, defineEventHandler, getValidatedQuery } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { parseFrontmatter } from '../../utils/parseFrontmatter'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = decodeURIComponent(path)

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + decodedPath

  const storage = useStorage('content')
  const file = await storage.getItem<string>(fullPath)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return parseFrontmatter(file)
})
