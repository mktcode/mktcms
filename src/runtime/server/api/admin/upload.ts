import z from 'zod'
import { createError, defineEventHandler, getValidatedQuery, readMultipartFormData } from 'h3'
import { useStorage } from 'nitropack/runtime'
import syncGitContent from '../../utils/syncGitContent'
import { normalizeContentKey, normalizeContentPrefix } from '../../utils/contentKey'
import { CONTENT_UPLOAD_EXTENSIONS, hasAllowedExtension } from '../../../shared/contentFiles'
import { assertUploadSize, getMaxUploadBytes } from '../../utils/uploadGuard'
import { toGitErrorMessage } from '../../utils/gitVersioning'

function sanitizeFilename(filename: string): string {
  return filename.replace(/[/:\\]/g, '_')
}

const querySchema = z.object({
  path: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const maxUploadBytes = getMaxUploadBytes()

  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentPrefix = normalizeContentPrefix(path)

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

  if (!hasAllowedExtension(file.filename, CONTENT_UPLOAD_EXTENSIONS)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only PDF, JPG, JPEG, PNG, GIF, WEBP, MD, DOCX, TXT, CSV, and JSON files are allowed.',
    })
  }

  assertUploadSize(file.data, maxUploadBytes)

  const filePath = normalizeContentKey([contentPrefix, sanitizeFilename(file.filename)].filter(Boolean).join(':'))
  await useStorage('content').setItemRaw(filePath, Buffer.from(file.data))

  try {
    await syncGitContent('Datei hinzugefügt', [filePath])
  }
  catch (error) {
    console.error('Git-Fehler:', toGitErrorMessage(error, 'Git sync failed'))
  }

  return { success: true, path: filePath }
})
