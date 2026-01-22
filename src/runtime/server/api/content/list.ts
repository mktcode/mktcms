import z from 'zod'
import { useStorage } from 'nitropack/runtime'
import { defineEventHandler, getValidatedQuery } from 'h3'
import { marked } from 'marked'
import { parseFrontmatter } from '../../utils/parseFrontmatter'

const querySchema = z.object({
  path: z.string().optional(),
  type: z.string(),
})

export default defineEventHandler(async (event) => {
  const { path, type } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = path ? decodeURIComponent(path) : undefined

  const storage = useStorage('content')
  const keys = await storage.getKeys(decodedPath)

  const filteredKeys = keys.filter((key) => {
    if (type === 'md') {
      return key.endsWith('.md')
    }
    if (type === 'json') {
      return key.endsWith('.json')
    }
    if (type === 'csv') {
      return key.endsWith('.csv')
    }
    if (type === 'txt') {
      return key.endsWith('.txt')
    }
    if (type === 'image') {
      return key.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
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
