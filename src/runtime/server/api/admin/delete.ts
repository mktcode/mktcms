import { z } from 'zod'
import { defineEventHandler, getValidatedQuery } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = decodeURIComponent(path)

  const storage = useStorage('content')
  await storage.removeItem(decodedPath)

  return { success: true }
})
