import { z } from 'zod'
import { defineEventHandler, getValidatedQuery } from 'h3'
import { useStorage } from 'nitropack/runtime'
import syncGitContent from '../../utils/syncGitContent'
import { normalizeContentKey } from '../../utils/contentKey'
import { toGitErrorMessage } from '../../utils/gitVersioning'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentKey = normalizeContentKey(path)

  const storage = useStorage('content')
  await storage.removeItem(contentKey)

  try {
    await syncGitContent('Datei gelöscht', [contentKey])
  }
  catch (error) {
    console.error('Git-Fehler:', toGitErrorMessage(error, 'Git sync failed'))
  }

  return { success: true }
})
