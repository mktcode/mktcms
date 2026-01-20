import { z } from 'zod'
import { defineEventHandler, getValidatedRouterParams, readValidatedBody } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { stringify } from 'yaml'

const paramsSchema = z.object({
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
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))
  const { frontmatter, markdown } = await readValidatedBody(event, body => bodySchema.parse(body))

  const content = buildContent(frontmatter, markdown)

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const storage = useStorage('content')
  await storage.setItem(fullPath, content)

  return { success: true }
})
