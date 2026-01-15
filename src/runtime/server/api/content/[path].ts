import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { parse } from 'csv-parse/sync'
import { marked } from 'marked'

function parsedFile(fullPath: string, file: string | number | boolean | object) {
  if (fullPath.endsWith('.json') && typeof file === 'string') {
    try {
      return JSON.parse(file)
    }
    catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid JSON file',
      })
    }
  }

  if (fullPath.endsWith('.csv') && typeof file === 'string') {
    try {
      return parse(file, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';',
      })
    }
    catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid CSV file',
      })
    }
  }

  if (fullPath.endsWith('.md') && typeof file === 'string') {
    try {
      const html = marked.parse(file)
      return html
    }
    catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid Markdown file',
      })
    }
  }

  return file
}

const paramsSchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const storage = useStorage('content')
  const file = await storage.getItem(fullPath)

  if (!file) {
    const fallbackStorage = useStorage('fallback')
    const fallbackFile = await fallbackStorage.getItem(fullPath)

    if (fallbackFile) {
      return parsedFile(fullPath, fallbackFile)
    }

    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return parsedFile(fullPath, file)
})
