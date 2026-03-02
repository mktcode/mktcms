import z from 'zod'
import { useStorage } from 'nitropack/runtime'
import { defineEventHandler, getValidatedQuery } from 'h3'
import { marked } from 'marked'
import { parseFrontmatter } from '../../utils/parseFrontmatter'
import { normalizeContentPrefix } from '../../utils/contentKey'
import { isCsvPath, isImagePath, isJsonPath, isMarkdownPath, isTextPath } from '../../../shared/contentFiles'

const querySchema = z.object({
  path: z.string().optional(),
  type: z.string(),
})

export default defineEventHandler(async (event) => {
  const { path, type } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentPrefix = normalizeContentPrefix(path)

  const storage = useStorage('content')
  const keys = await storage.getKeys(contentPrefix)

  const filteredKeys = keys.filter((key) => {
    if (type === 'md') {
      return isMarkdownPath(key)
    }
    if (type === 'json') {
      return isJsonPath(key)
    }
    if (type === 'csv') {
      return isCsvPath(key)
    }
    if (type === 'txt') {
      return isTextPath(key)
    }
    if (type === 'image') {
      return isImagePath(key)
    }
    return false
  })

  if (type === 'image') {
    return filteredKeys
  }

  const items = await storage.getItems(filteredKeys)

  return items.map((item) => {
    if (type === 'md' && typeof item.value === 'string') {
      const markdownItem = parseFrontmatter(item.value)

      return {
        key: item.key,
        value: {
          ...markdownItem,
          html: marked.parse(markdownItem.markdown),
        },
      }
    }
    return item
  })
})
