import { z } from 'zod'
import { defineEventHandler, getValidatedQuery } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { normalizeContentKey } from '../../utils/contentKey'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentKey = normalizeContentKey(path)

  const storage = useStorage('content')
  const file = await storage.getItemRaw(contentKey)

  const isImage = contentKey.match(/\.(png|jpg|jpeg|gif|webp)$/i)
  const isPdf = contentKey.endsWith('.pdf')
  const isJson = contentKey.endsWith('.json')
  const isCSV = contentKey.endsWith('.csv')

  if (isImage) {
    event.node.res.setHeader('Content-Type', 'image/' + contentKey.split('.').pop()?.toLowerCase())
  }
  else if (isPdf) {
    event.node.res.setHeader('Content-Type', 'application/pdf')
  }
  else if (isJson || isCSV) {
    event.node.res.setHeader('Content-Type', 'application/json; charset=utf-8')
  }
  else {
    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  }

  event.node.res.setHeader('Content-Disposition', `attachment; filename="${contentKey.split(':').pop()}"`)

  return file
})
