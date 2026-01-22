import { z } from 'zod'
import { createError, defineEventHandler, getValidatedQuery } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { parse } from 'csv-parse/sync'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = decodeURIComponent(path)

  const storage = useStorage('content')
  const file = await storage.getItem<string>(decodedPath)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  const table = parse(file, {
    skip_empty_lines: true,
    delimiter: ';',
  })

  const headers = Array.isArray(table[0]) ? table[0].map(cell => String(cell ?? '')) : []

  const rows = table.slice(1)

  return { headers, rows }
})
