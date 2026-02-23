import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useStorage } from 'nitropack/runtime'
import syncGitContent from '../../utils/syncGitContent'

const querySchema = z.object({
  path: z.string().min(1),
})

const bodySchema = z.object({
  text: z.string(),
  commitMessage: z.string().trim().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const { text, commitMessage } = await readValidatedBody(event, body => bodySchema.parse(body))

  const decodedPath = decodeURIComponent(path)

  const storage = useStorage('content')
  await storage.setItem(decodedPath, text)

  try {
    await syncGitContent(commitMessage, [decodedPath])
  }
  catch (error) {
    console.error('Git-Fehler:', error)
  }

  return { success: true }
})
