import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams, send } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { toNodeBuffer } from '../../utils/toNodeBuffer'
import { parsedFile } from '../../utils/parsedFile'
import { normalizeContentKey } from '../../utils/contentKey'
import { isCsvPath, isImagePath, isJsonPath, isMarkdownPath, isPdfPath, toFileExtension } from '../../../shared/contentFiles'

const CACHE_CONTROL_BINARY = 'public, max-age=86400, stale-while-revalidate=604800'

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
    const meta = await storage.getMeta(contentKey)
    const metaRecord = meta && typeof meta === 'object'
      ? meta as Record<string, unknown>
      : undefined

    const mtimeCandidate = metaRecord?.mtime ?? metaRecord?.updatedAt
    const lastModifiedMs = mtimeCandidate instanceof Date
      ? mtimeCandidate.getTime()
      : typeof mtimeCandidate === 'number'
        ? mtimeCandidate
        : typeof mtimeCandidate === 'string'
          ? Date.parse(mtimeCandidate)
          : undefined

    const lastModifiedSeconds = Number.isFinite(lastModifiedMs)
      ? Math.floor((lastModifiedMs as number) / 1000)
      : undefined

    const etagVersion = Number.isFinite(lastModifiedMs)
      ? Math.floor(lastModifiedMs as number)
      : 0
    const etag = `W/"${etagVersion.toString(36)}-${body.byteLength.toString(36)}"`

    event.node.res.setHeader('Cache-Control', CACHE_CONTROL_BINARY)
    event.node.res.setHeader('ETag', etag)
    if (lastModifiedSeconds !== undefined) {
      event.node.res.setHeader('Last-Modified', new Date(lastModifiedSeconds * 1000).toUTCString())
    }

    const ifNoneMatch = event.node.req.headers['if-none-match']
    const ifModifiedSince = event.node.req.headers['if-modified-since']

    const normalizedEtag = etag.replace(/^W\//, '').trim()
    const hasIfNoneMatch = !!ifNoneMatch
    const etagMatched = hasIfNoneMatch && (ifNoneMatch.trim() === '*'
      || ifNoneMatch
        .split(',')
        .map(token => token.trim().replace(/^W\//, '').trim())
        .some(token => token === normalizedEtag))

    const ifModifiedSinceMs = ifModifiedSince ? Date.parse(ifModifiedSince) : Number.NaN
    const ifModifiedSinceMatched = !hasIfNoneMatch
      && lastModifiedSeconds !== undefined
      && !Number.isNaN(ifModifiedSinceMs)
      && lastModifiedSeconds <= Math.floor(ifModifiedSinceMs / 1000)

    const isNotModified = etagMatched || ifModifiedSinceMatched

    if (isNotModified) {
      event.node.res.statusCode = 304
      return ''
    }

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
