import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { stringify } from 'yaml'

const querySchema = z.object({
  path: z.string().min(1),
})

const bodySchema = z.object({
  frontmatter: z.record(z.string(), z.any()),
  markdown: z.string(),
})

function buildContent(frontmatter: Record<string, any>, markdown: string) {
  if (Object.keys(frontmatter).length === 0) {
    return markdown
  }

  const frontmatterYaml = stringify(frontmatter)
  return `---\n${frontmatterYaml}---\n${markdown}`
}

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, query => querySchema.parse(query))
  const { frontmatter, markdown } = await readValidatedBody(event, body => bodySchema.parse(body))

  const decodedPath = decodeURIComponent(path)

  const content = buildContent(frontmatter, markdown)

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + decodedPath

  const storage = useStorage('content')
  await storage.setItem(fullPath, content)

  return { success: true }
})
