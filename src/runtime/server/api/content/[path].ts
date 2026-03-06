import { z } from 'zod'
import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'
import { createError, defineEventHandler, getValidatedRouterParams, send } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { toNodeBuffer } from '../../utils/toNodeBuffer'
import { parsedFile } from '../../utils/parsedFile'
import { normalizeContentKey } from '../../utils/contentKey'
import { isCsvPath, isImagePath, isJsonPath, isMarkdownPath, isPdfPath, toFileExtension } from '../../../shared/contentFiles'

const CACHE_CONTROL_CONTENT = 'public, max-age=86400, stale-while-revalidate=604800'

function getMetaRecord(meta: unknown) {
  if (!meta || typeof meta !== 'object') {
    return undefined
  }

  return meta as Record<string, unknown>
}

function getLastModifiedMs(meta: unknown) {
  const metaRecord = getMetaRecord(meta)
  const mtimeCandidate = metaRecord?.mtime ?? metaRecord?.updatedAt

  if (mtimeCandidate instanceof Date) {
    return mtimeCandidate.getTime()
  }

  if (typeof mtimeCandidate === 'number' && Number.isFinite(mtimeCandidate)) {
    return mtimeCandidate
  }

  if (typeof mtimeCandidate === 'string') {
    const parsed = Date.parse(mtimeCandidate)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  return undefined
}

function getSizeBytes(meta: unknown, fallbackContent?: string | number | boolean | object, fallbackRawSize?: number) {
  if (typeof fallbackRawSize === 'number' && Number.isFinite(fallbackRawSize)) {
    return fallbackRawSize
  }

  const metaSize = getMetaRecord(meta)?.size
  if (typeof metaSize === 'number' && Number.isFinite(metaSize)) {
    return metaSize
  }

  if (typeof fallbackContent === 'string') {
    return Buffer.byteLength(fallbackContent)
  }

  if (fallbackContent !== undefined) {
    return Buffer.byteLength(JSON.stringify(fallbackContent))
  }

  return 0
}

function getContentFingerprint(content: unknown) {
  if (content === undefined || content === null) {
    return undefined
  }

  if (Buffer.isBuffer(content)) {
    return createHash('sha1').update(content).digest('base64url').slice(0, 12)
  }

  if (typeof content === 'string') {
    return createHash('sha1').update(content).digest('base64url').slice(0, 12)
  }

  return createHash('sha1').update(JSON.stringify(content)).digest('base64url').slice(0, 12)
}

function buildWeakEtag(lastModifiedMs: number | undefined, sizeBytes: number, fingerprint?: string) {
  const etagVersion = Number.isFinite(lastModifiedMs) ? Math.floor(lastModifiedMs as number) : 0
  const base = `${etagVersion.toString(36)}-${Math.floor(sizeBytes).toString(36)}`
  return `W/"${fingerprint ? `${base}-${fingerprint}` : base}"`
}

function toHeaderString(value: string | string[] | undefined) {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value.join(',')
  }

  return undefined
}

function ifNoneMatchMatches(headerValue: string | undefined, etag: string) {
  if (!headerValue) {
    return false
  }

  if (headerValue.trim() === '*') {
    return true
  }

  const normalizedEtag = etag.replace(/^W\//, '').trim()
  return headerValue
    .split(',')
    .map(token => token.trim().replace(/^W\//, '').trim())
    .includes(normalizedEtag)
}

function ifModifiedSinceMatches(headerValue: string | undefined, lastModifiedMs: number | undefined) {
  if (!headerValue || !Number.isFinite(lastModifiedMs)) {
    return false
  }

  const ifModifiedSinceMs = Date.parse(headerValue)
  if (Number.isNaN(ifModifiedSinceMs)) {
    return false
  }

  const lastModifiedSeconds = Math.floor((lastModifiedMs as number) / 1000)
  const ifModifiedSinceSeconds = Math.floor(ifModifiedSinceMs / 1000)
  return lastModifiedSeconds <= ifModifiedSinceSeconds
}

function setCachingHeaders(event: H3Event, etag: string, lastModifiedMs: number | undefined) {
  event.node.res.setHeader('Cache-Control', CACHE_CONTROL_CONTENT)
  event.node.res.setHeader('ETag', etag)

  if (Number.isFinite(lastModifiedMs)) {
    const lastModifiedSeconds = Math.floor((lastModifiedMs as number) / 1000)
    event.node.res.setHeader('Last-Modified', new Date(lastModifiedSeconds * 1000).toUTCString())
  }
}

function isNotModified(event: H3Event, etag: string, lastModifiedMs: number | undefined) {
  const ifNoneMatch = toHeaderString(event.node.req.headers['if-none-match'])
  if (ifNoneMatch) {
    return ifNoneMatchMatches(ifNoneMatch, etag)
  }

  const ifModifiedSince = toHeaderString(event.node.req.headers['if-modified-since'])
  return ifModifiedSinceMatches(ifModifiedSince, lastModifiedMs)
}

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
    else if (ext === 'svg') {
      return 'image/svg+xml'
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
  const meta = await storage.getMeta(contentKey)
  const lastModifiedMs = getLastModifiedMs(meta)

  if (isImage || isPdf) {
    const raw = await storage.getItemRaw(contentKey)

    if (raw == null) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found',
      })
    }

    const body = toNodeBuffer(raw)
    const etag = buildWeakEtag(
      lastModifiedMs,
      getSizeBytes(meta, undefined, body.byteLength),
      Number.isFinite(lastModifiedMs) ? undefined : getContentFingerprint(body),
    )

    setCachingHeaders(event, etag, lastModifiedMs)

    if (isNotModified(event, etag, lastModifiedMs)) {
      event.node.res.statusCode = 304
      return
    }

    event.node.res.setHeader('Content-Length', String(body.byteLength))
    return send(event, body)
  }

  const file = await storage.getItem(contentKey)

  if (file == null) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  const etag = buildWeakEtag(
    lastModifiedMs,
    getSizeBytes(meta, file),
    Number.isFinite(lastModifiedMs) ? undefined : getContentFingerprint(file),
  )
  setCachingHeaders(event, etag, lastModifiedMs)

  if (isNotModified(event, etag, lastModifiedMs)) {
    event.node.res.statusCode = 304
    return
  }

  return parsedFile(contentKey, file)
})
