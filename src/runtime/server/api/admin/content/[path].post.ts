import { z } from 'zod'
import { defineEventHandler, getValidatedRouterParams, readValidatedBody } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'

const paramsSchema = z.object({
  path: z.string().min(1),
})

const bodySchema = z.object({
  content: z.string(),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))
  const { content } = await readValidatedBody(event, body => bodySchema.parse(body))

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const storage = useStorage('content')
  const file = await storage.setItem(fullPath, content)

  return file
})
