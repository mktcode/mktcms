import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'

const paramsSchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const isImage = path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
  const isPdf = path.endsWith('.pdf')

  if (isImage) {
    event.node.res.setHeader('Content-Type', 'image/' + path.split('.').pop()?.toLowerCase())
  }
  else if (isPdf) {
    event.node.res.setHeader('Content-Type', 'application/pdf')
  }
  else {
    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  }

  const storage = useStorage('content')
  const file = isImage || isPdf ? await storage.getItemRaw(fullPath) : await storage.getItem(fullPath)

  if (!file) {
    const fallbackStorage = useStorage('fallback')
    const fallbackFile = isImage || isPdf ? await fallbackStorage.getItemRaw(fullPath) : await fallbackStorage.getItem(fullPath)
    if (fallbackFile) {
      return fallbackFile
    }

    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return file
})
