import z from 'zod'
import { createError, defineEventHandler, getValidatedQuery, readMultipartFormData } from 'h3'
import { useStorage } from 'nitropack/runtime'
import sharp from 'sharp'

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
      statusMessage: 'Invalid file type. Only JPG, JPEG, PNG, GIF, SVG, WEBP files are allowed.',
    })
  }

  const image = sharp(file.data)
  const metadata = await image.metadata()

  if (metadata.width && metadata.height) {
    if (metadata.width > 1920 || metadata.height > 1920) {
      image.resize({
        width: metadata.width > metadata.height ? 1920 : undefined,
        height: metadata.height >= metadata.width ? 1920 : undefined,
        fit: 'inside',
      })
    }
  }

  image.webp({ quality: 60 })

  const webpBuffer = await image.toBuffer()

  await useStorage('content').setItemRaw(path, webpBuffer)

  return { success: true, path }
})
