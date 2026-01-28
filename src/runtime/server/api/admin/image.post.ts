import z from 'zod'
import { createError, defineEventHandler, getValidatedQuery, readMultipartFormData } from 'h3'
import { useStorage } from 'nitropack/runtime'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)

  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))

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

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']
  const fileExtension = file.filename.toLowerCase().slice(file.filename.lastIndexOf('.'))

  if (!allowedExtensions.includes(fileExtension)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only PDF, JPG, JPEG, PNG, GIF, SVG, WEBP, MD, DOCX, TXT, CSV, and JSON files are allowed.',
    })
  }

  await useStorage('content').setItemRaw(path, Buffer.from(file.data))

  return { success: true, path }
})
