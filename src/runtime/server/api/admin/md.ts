import { z } from 'zod'
import { minimatch } from 'minimatch'
import { createError, defineEventHandler, getValidatedQuery } from 'h3'
import { useStorage, useRuntimeConfig } from 'nitropack/runtime'
import { parseFrontmatter } from '../../utils/parseFrontmatter'
import { normalizeContentKey } from '../../utils/contentKey'

const querySchema = z.object({
  path: z.string().min(1),
})

function findFrontmatterSchema(filePath: string, schemas: Record<string, any>) {
  for (const pattern in schemas) {
    if (minimatch(filePath, pattern)) {
      return schemas[pattern]
    }
  }

  return null
}

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const contentKey = normalizeContentKey(path)

  const storage = useStorage('content')
  const file = await storage.getItem<string>(contentKey)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return {
    ...parseFrontmatter(file),
    schema: findFrontmatterSchema(path, useRuntimeConfig().mktcms.frontmatter),
  }
})
