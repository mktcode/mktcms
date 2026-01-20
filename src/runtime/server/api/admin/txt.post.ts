import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'

const querySchema = z.object({
  path: z.string().min(1),
})

const bodySchema = z.object({
  text: z.string(),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const { text } = await readValidatedBody(event, body => bodySchema.parse(body))

  const decodedPath = decodeURIComponent(path)

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + decodedPath

  const storage = useStorage('content')
  await storage.setItem(fullPath, text)

  return { success: true }
})
