import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useStorage } from 'nitropack/runtime'

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

  const storage = useStorage('content')
  await storage.setItem(decodedPath, text)

  return { success: true }
})
