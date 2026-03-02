import { z } from 'zod'
import { defineEventHandler, getValidatedQuery } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { normalizeContentKey } from '../../utils/contentKey'
import { isCsvPath, isImagePath, isJsonPath, isPdfPath, toFileExtension } from '../../../shared/contentFiles'

const querySchema = z.object({
  path: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentKey = normalizeContentKey(path)

  const storage = useStorage('content')
  const file = await storage.getItemRaw(contentKey)

  const isImage = isImagePath(contentKey)
  const isPdf = isPdfPath(contentKey)
  const isJson = isJsonPath(contentKey)
  const isCSV = isCsvPath(contentKey)

  if (isImage) {
    const extension = toFileExtension(contentKey).slice(1)
    event.node.res.setHeader('Content-Type', 'image/' + extension)
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
