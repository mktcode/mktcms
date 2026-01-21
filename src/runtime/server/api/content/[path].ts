import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams, send } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { toNodeBuffer } from '../../utils/toNodeBuffer'
import { parsedFile } from '../../utils/parsedFile'

function getFileType(path: string) {
  const isImage = path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
  const isPdf = path.endsWith('.pdf')
  const isJson = path.endsWith('.json')
  const isCSV = path.endsWith('.csv')
  const isMarkdown = path.endsWith('.md')
  return { isImage, isPdf, isJson, isCSV, isMarkdown }
}

function getContentType(path: string) {
  const { isImage, isPdf, isJson, isCSV, isMarkdown } = getFileType(path)

  if (isImage) {
    const ext = path.split('.').pop()?.toLowerCase()

    if (ext === 'svg') {
      return 'image/svg+xml'
    }
    else if (ext === 'jpg') {
      return 'image/jpeg'
    }
    else {
      return 'image/' + ext
    }
  }
  else if (isPdf) {
    return 'application/pdf'
  }
  else if (isJson || isCSV || isMarkdown) {
    return 'application/json; charset=utf-8'
  }
  else {
    return 'text/plain; charset=utf-8'
  }
}

const paramsSchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))
  const decodedPath = decodeURIComponent(path)
  const fullPath = s3Prefix + ':' + decodedPath

  const { isImage, isPdf } = getFileType(decodedPath)

  event.node.res.setHeader('Content-Type', getContentType(decodedPath))

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
