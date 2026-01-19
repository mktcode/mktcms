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

  const isImage = path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
  const isPdf = path.endsWith('.pdf')
  const isJson = path.endsWith('.json')
  const isCSV = path.endsWith('.csv')

  if (isImage) {
    event.node.res.setHeader('Content-Type', 'image/' + path.split('.').pop()?.toLowerCase())
  }
  else if (isPdf) {
    event.node.res.setHeader('Content-Type', 'application/pdf')
  }
  else if (isJson || isCSV) {
    event.node.res.setHeader('Content-Type', 'application/json; charset=utf-8')
  }
  else {
    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  }

  const storage = useStorage('content')
  const file = isImage || isPdf ? await storage.getItemRaw(fullPath) : await storage.getItem(fullPath)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return parsedFile(fullPath, file)
})
