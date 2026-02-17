import z from 'zod'
import { createError, defineEventHandler, getValidatedQuery, readMultipartFormData } from 'h3'
import { useStorage } from 'nitropack/runtime'
import sharp from 'sharp'
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

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const fileExtension = file.filename.toLowerCase().slice(file.filename.lastIndexOf('.'))

  const targetExtension = decodedPath.toLowerCase().slice(decodedPath.lastIndexOf('.'))

  if (!allowedExtensions.includes(targetExtension)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid target file type. Only JPG, JPEG, PNG, GIF, WEBP files are allowed.',
    })
  }

  if (!allowedExtensions.includes(fileExtension)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only JPG, JPEG, PNG, GIF, WEBP files are allowed.',
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

  switch (targetExtension) {
    case '.jpg':
    case '.jpeg':
      image.flatten({ background: '#ffffff' }).jpeg({ quality: 60, mozjpeg: true })
      break
    case '.png':
      image.png({ compressionLevel: 9, adaptiveFiltering: true })
      break
    case '.webp':
      image.webp({ quality: 60 })
      break
    case '.gif':
      if (typeof (image as any).gif === 'function') {
        ;(image as any).gif()
      }
      else {
        throw createError({
          statusCode: 400,
          statusMessage: 'Target is GIF but GIF output is not supported by this server build.',
        })
      }
      break
    default:
      throw createError({
        statusCode: 400,
        statusMessage: 'Unsupported target image format.',
      })
  }

  const outputBuffer = await image.toBuffer()

  await useStorage('content').setItemRaw(decodedPath, outputBuffer)

  try {
    await syncGitContent('Bild ersetzt', [decodedPath])
  }
  catch (error) {
    console.error('Git-Fehler:', error)
  }

  return { success: true, path: decodedPath }
})
