import z from 'zod'
import { createError, defineEventHandler, getValidatedQuery, readMultipartFormData } from 'h3'
import { useStorage } from 'nitropack/runtime'
import syncGitContent from '../../utils/syncGitContent'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)

  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = decodeURIComponent(path)

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

  const fileExtension = file.filename.toLowerCase().slice(file.filename.lastIndexOf('.'))
  const targetExtension = decodedPath.toLowerCase().slice(decodedPath.lastIndexOf('.'))

  if (targetExtension !== '.pdf') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid target file type. Only PDF files are allowed.',
    })
  }

  if (fileExtension !== '.pdf') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only PDF files are allowed.',
    })
  }

  await useStorage('content').setItemRaw(decodedPath, Buffer.from(file.data))

  try {
    await syncGitContent('PDF ersetzt', [decodedPath])
  }
  catch (error) {
    console.error('Git-Fehler:', error)
  }

  return { success: true, path: decodedPath }
})