import { z } from 'zod'
import { createError, defineEventHandler, getValidatedQuery } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = decodeURIComponent(path)

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + decodedPath

  const storage = useStorage('content')
  const file = await storage.getItemRaw(fullPath)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  const extension = decodedPath.split('.').pop()?.toLowerCase() || 'bin'
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    pdf: 'application/pdf',
    txt: 'text/plain; charset=utf-8',
    md: 'text/markdown; charset=utf-8',
    csv: 'text/csv; charset=utf-8',
    json: 'application/json',
  }
  const contentType = mimeTypes[extension] || 'application/octet-stream'
  event.node.res.setHeader('Content-Type', contentType)

  return file
})
