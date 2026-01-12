import z from 'zod'
import { useStorage, useRuntimeConfig } from 'nitropack/runtime'
import { defineEventHandler, getValidatedQuery } from 'h3'

const querySchema = z.object({
  path: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))

  const { mktcms: { filesPathPrefix } } = useRuntimeConfig()

  const storage = useStorage('content')
  const keys = await storage.getKeys(filesPathPrefix + (path ? ':' + path : ''))

  return keys.map(key => key.replace(filesPathPrefix + ':', ''))
})