import z from 'zod'
import { useStorage } from 'nitropack/runtime'
import { defineEventHandler, getValidatedQuery } from 'h3'
import { normalizeContentPrefix } from '../../utils/contentKey'
import { isImagePath, isPdfPath } from '../../../shared/contentFiles'

function alphaSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

const querySchema = z.object({
  path: z.string().optional(),
  type: z.enum(['image', 'pdf', 'file']).optional(),
})

export default defineEventHandler(async (event) => {
  const { path, type } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentPrefix = normalizeContentPrefix(path)

  const storage = useStorage('content')
  const keys = await storage.getKeys(contentPrefix)
  const keysWithoutPath = contentPrefix ? keys.map(key => key.replace(contentPrefix + ':', '')) : keys

  const matchingKeys = keysWithoutPath.filter((key: string) => {
    if (type === 'image') {
      return isImagePath(key)
    }

    if (type === 'pdf') {
      return isPdfPath(key)
    }

    return true
  })

  const filteredFiles = matchingKeys.filter((key: string) => !key.includes(':'))

  const dirs = matchingKeys
    .filter((key: string) => key.includes(':'))
    .map((key: string) => key.split(':')[0]!)

  const uniqueDirs = Array.from(new Set(dirs))

  return {
    files: [...filteredFiles].sort(alphaSort),
    dirs: [...uniqueDirs].sort(alphaSort),
  }
})
