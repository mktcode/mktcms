import z from 'zod'
import { createError, defineEventHandler, getValidatedQuery, readMultipartFormData } from 'h3'
import { useStorage } from 'nitropack/runtime'

function sanitizeFilename(filename: string): string {
  return filename.replace(/[/:\\]/g, '_')
}

const querySchema = z.object({
  path: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)

  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const sanePath = path ? path.replace(/^\//, '').replace(/\/$/, '') : undefined

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

  // TODO: allow all image types and convert to webp on the fly
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.md', '.docx', '.txt', '.csv', '.json']
  const fileExtension = file.filename.toLowerCase().slice(file.filename.lastIndexOf('.'))

  if (!allowedExtensions.includes(fileExtension)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only PDF, JPG, JPEG, PNG, GIF, SVG, WEBP, MD, DOCX, TXT, CSV, and JSON files are allowed.',
    })
  }

  const filePath = [sanePath, sanitizeFilename(file.filename)].filter(Boolean).join(':')
  await useStorage('content').setItemRaw(filePath, Buffer.from(file.data))

  return { success: true, path: filePath }
})
