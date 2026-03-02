import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { stringify } from 'csv-stringify/sync'
import syncGitContent from '../../utils/syncGitContent'
import { normalizeContentKey } from '../../utils/contentKey'
import { toGitErrorMessage } from '../../utils/gitVersioning'

const querySchema = z.object({
  path: z.string().min(1),
})

const bodySchema = z.object({
  table: z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  commitMessage: z.string().trim().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const { table, commitMessage } = await readValidatedBody(event, body => bodySchema.parse(body))

  const contentKey = normalizeContentKey(path)

  const content = stringify(table.rows, {
    header: true,
    columns: table.headers,
    delimiter: ';',
  })

  const storage = useStorage('content')
  await storage.setItem(contentKey, content)

  try {
    await syncGitContent(commitMessage, [contentKey])
  }
  catch (error) {
    console.error('Git-Fehler:', toGitErrorMessage(error, 'Git sync failed'))
  }

  return { success: true }
})
