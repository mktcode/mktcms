import z from 'zod'
import { useStorage, useRuntimeConfig } from 'nitropack/runtime'
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

  const { mktcms: { s3Prefix } } = useRuntimeConfig()

  const storage = useStorage('content')
  const keys = await storage.getKeys(s3Prefix + (decodedPath ? ':' + decodedPath : ''))

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
    return false
  })

  const items = await storage.getItems(filteredKeys)

  return items.map((item) => {
    if (type === 'md' && typeof item.value === 'string') {
      const markdownItem = parseFrontmatter(item.value)

      return {
        key: item.key.replace(s3Prefix + ':', ''),
        value: {
          ...markdownItem,
          html: marked.parse(markdownItem.markdown),
        },
      }
    }
    return item
  })
})
