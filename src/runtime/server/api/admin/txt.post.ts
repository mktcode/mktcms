import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useStorage } from 'nitropack/runtime'
import syncGitContent from '../../utils/syncGitContent'
import { normalizeContentKey } from '../../utils/contentKey'

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

  const contentKey = normalizeContentKey(path)

  const storage = useStorage('content')
  await storage.setItem(contentKey, text)

  try {
    await syncGitContent(commitMessage, [contentKey])
  }
  catch (error) {
    console.error('Git-Fehler:', error)
  }

  return { success: true }
})
