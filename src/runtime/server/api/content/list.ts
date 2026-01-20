import z from 'zod'
import { useStorage, useRuntimeConfig } from 'nitropack/runtime'
import { defineEventHandler, getValidatedQuery } from 'h3'

const querySchema = z.object({
  path: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = path ? decodeURIComponent(path) : undefined

  const { mktcms: { s3Prefix } } = useRuntimeConfig()

  const storage = useStorage('content')
  const keys = await storage.getKeys(s3Prefix + (decodedPath ? ':' + decodedPath : ''))

  return keys.map(key => key.replace(s3Prefix + ':', ''))
})
