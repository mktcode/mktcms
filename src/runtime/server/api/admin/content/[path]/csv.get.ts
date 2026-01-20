import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { parse } from 'csv-parse/sync'

const paramsSchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const storage = useStorage('content')
  const file = await storage.getItemRaw(fullPath)

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
