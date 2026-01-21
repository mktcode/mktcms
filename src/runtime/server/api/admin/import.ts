import { createError, defineEventHandler, readMultipartFormData } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import path from 'node:path'
import unzipper from 'unzipper'

function sanitizePathSegment(segment: string): string {
  return segment.replace(/[/:\\]/g, '_').replace(/\0/g, '')
}

function zipPathToColonKey(entryPath: string): string {
  // ZIP paths are typically POSIX but can contain backslashes.
  const original = entryPath.replace(/\\/g, '/')
  if (original.startsWith('/')) {
    return ''
  }

  let p = original.replace(/^\.\//, '')

  // Reject Windows drive-letter absolute paths (e.g. C:/foo).
  if (/^[a-zA-Z]:\//.test(p)) {
    return ''
  }

  if (!p || p.includes('\0')) {
    return ''
  }

  // Normalize and prevent zip-slip.
  p = path.posix.normalize(p)
  if (p === '.' || p === '..' || p.startsWith('../') || p.includes('/../')) {
    return ''
  }

  const parts = p.split('/').filter(Boolean)
  if (parts.some(part => part === '.' || part === '..')) {
    return ''
  }

  const sanitizedParts = parts.map(sanitizePathSegment)
  return sanitizedParts.join(':')
}

function withPrefix(s3Prefix: string, colonKey: string): string {
  return [s3Prefix, colonKey].filter(Boolean).join(':')
}

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const { mktcms: { s3Prefix } } = useRuntimeConfig()

  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No form data received',
    })
  }

  const file = form.find(item => item.name === 'file')

  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing file',
    })
  }

  if (!file.filename || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file upload',
    })
  }

  const allowedExtensions = ['.zip']
  const fileExtension = file.filename.toLowerCase().slice(file.filename.lastIndexOf('.'))

  if (!allowedExtensions.includes(fileExtension)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only ZIP files are allowed for import.',
    })
  }

  const zipBuffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data)

  let zip
  try {
    zip = await unzipper.Open.buffer(zipBuffer)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ZIP file' })
  }

  const storage = useStorage('content')
  const written = new Set<string>()

  for (const entry of zip.files) {
    if (!entry.path) {
      continue
    }

    // Directories are represented implicitly by colon-separated file keys.
    if (entry.type === 'Directory') continue

    // Handle files.
    const fileColonKey = zipPathToColonKey(entry.path)
    if (!fileColonKey) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid ZIP entry path: ${entry.path}`,
      })
    }

    const fullKey = withPrefix(s3Prefix, fileColonKey)
    const data = await entry.buffer()
    await storage.setItemRaw(fullKey, data)
    written.add(fullKey)
  }

  return { success: true, count: written.size }
})
