import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams, send } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { toNodeBuffer } from '../../utils/toNodeBuffer'
import { parsedFile } from '../../utils/parsedFile'
import { normalizeContentKey } from '../../utils/contentKey'
import { isCsvPath, isImagePath, isJsonPath, isMarkdownPath, isPdfPath, toFileExtension } from '../../../shared/contentFiles'

function getFileType(path: string) {
  const isImage = isImagePath(path)
  const isPdf = isPdfPath(path)
  const isJson = isJsonPath(path)
  const isCSV = isCsvPath(path)
  const isMarkdown = isMarkdownPath(path)
  return { isImage, isPdf, isJson, isCSV, isMarkdown }
}

function getContentType(path: string) {
  const { isImage, isPdf, isJson, isCSV, isMarkdown } = getFileType(path)

  if (isImage) {
    const ext = toFileExtension(path).slice(1)

    if (ext === 'jpg') {
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
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))
  const contentKey = normalizeContentKey(path)

  const { isImage, isPdf } = getFileType(contentKey)

  event.node.res.setHeader('Content-Type', getContentType(contentKey))

  const storage = useStorage('content')

  if (isImage || isPdf) {
    const raw = await storage.getItemRaw(contentKey)

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

  const file = await storage.getItem(contentKey)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return parsedFile(contentKey, file)
})
