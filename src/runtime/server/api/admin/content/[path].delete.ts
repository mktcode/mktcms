import { z } from 'zod'
import { defineEventHandler, getValidatedRouterParams } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'

const paramsSchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const storage = useStorage('content')
  await storage.removeItem(fullPath)

  return { success: true }
})
