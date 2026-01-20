import { z } from 'zod'
import { createError, defineEventHandler, getValidatedRouterParams } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { parse } from 'yaml'

const paramsSchema = z.object({
  path: z.string().min(1),
})

function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, markdown: content }
  }

  const frontmatterRaw = match[1]
  const markdown = content.slice(match[0].length)

  if (!frontmatterRaw) {
    return { frontmatter: {}, markdown }
  }

  let frontmatter: Record<string, any> = {}
  try {
    frontmatter = parse(frontmatterRaw)
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid frontmatter in Markdown file',
    })
  }

  return { frontmatter, markdown }
}

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const storage = useStorage('content')
  const file = await storage.getItemRaw(fullPath)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  return parseFrontmatter(file.toString('utf-8'))
})
