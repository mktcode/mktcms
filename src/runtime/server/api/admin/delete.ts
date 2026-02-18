import { z } from 'zod'
import { defineEventHandler, getValidatedQuery } from 'h3'
import { useStorage } from 'nitropack/runtime'
import syncGitContent from '../../utils/syncGitContent'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = decodeURIComponent(path)

  const storage = useStorage('content')
  await storage.removeItem(decodedPath)

  try {
    await syncGitContent('Datei gelöscht', [decodedPath])
  }
  catch (error) {
    console.error('Git-Fehler:', error)
  }

  return { success: true }
})
