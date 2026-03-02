import z from 'zod'
import { createError, defineEventHandler, getValidatedQuery, readMultipartFormData } from 'h3'
import { useStorage } from 'nitropack/runtime'
import syncGitContent from '../../utils/syncGitContent'
import { normalizeContentKey } from '../../utils/contentKey'
import { isPdfPath, toFileExtension } from '../../../shared/contentFiles'
import { assertUploadSize, getMaxUploadBytes } from '../../utils/uploadGuard'
import { toGitErrorMessage } from '../../utils/gitVersioning'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const maxUploadBytes = getMaxUploadBytes()

  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentKey = normalizeContentKey(path)

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

  if (!isPdfPath(contentKey)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid target file type. Only PDF files are allowed.',
    })
  }

  if (!isPdfPath(file.filename)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only PDF files are allowed.',
    })
  }

  assertUploadSize(file.data, maxUploadBytes)

  await useStorage('content').setItemRaw(contentKey, Buffer.from(file.data))

  try {
    await syncGitContent('PDF ersetzt', [contentKey])
  }
  catch (error) {
    console.error('Git-Fehler:', toGitErrorMessage(error, 'Git sync failed'))
  }

  return { success: true, path: contentKey }
})
