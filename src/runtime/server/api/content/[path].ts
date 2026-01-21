import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams, send } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { toNodeBuffer } from '../../utils/toNodeBuffer'
import { parsedFile } from '../../utils/parsedFile'

const paramsSchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))
  const decodedPath = decodeURIComponent(path)

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + decodedPath

  const isImage = decodedPath.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
  const isPdf = decodedPath.endsWith('.pdf')
  const isJson = decodedPath.endsWith('.json')
  const isCSV = decodedPath.endsWith('.csv')
  const isMarkdown = decodedPath.endsWith('.md')

  if (isImage) {
    const ext = decodedPath.split('.').pop()?.toLowerCase()

    if (ext === 'svg') {
      event.node.res.setHeader('Content-Type', 'image/svg+xml')
    }
    else if (ext === 'jpg') {
      event.node.res.setHeader('Content-Type', 'image/jpeg')
    }
    else {
      event.node.res.setHeader('Content-Type', 'image/' + ext)
    }
  }
  else if (isPdf) {
    event.node.res.setHeader('Content-Type', 'application/pdf')
  }
  else if (isJson || isCSV || isMarkdown) {
    event.node.res.setHeader('Content-Type', 'application/json; charset=utf-8')
  }
  else {
    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  }

  const storage = useStorage('content')

  if (isImage || isPdf) {
    const raw = await storage.getItemRaw(fullPath)

    if (!raw) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found',
      })
    }

    const body = toNodeBuffer(raw)
    event.node.res.setHeader('Content-Length', String(body.byteLength))
    return send(event, body)
  }

  const file = await storage.getItem(fullPath)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return parsedFile(fullPath, file)
})
