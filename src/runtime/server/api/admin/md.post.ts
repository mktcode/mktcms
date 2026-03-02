import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { stringify } from 'yaml'
import syncGitContent from '../../utils/syncGitContent'
import { normalizeContentKey } from '../../utils/contentKey'

const querySchema = z.object({
  path: z.string().min(1),
})

const bodySchema = z.object({
  frontmatter: z.record(z.string(), z.any()),
  markdown: z.string(),
  commitMessage: z.string().trim().min(1),
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
  const { frontmatter, markdown, commitMessage } = await readValidatedBody(event, body => bodySchema.parse(body))

  const contentKey = normalizeContentKey(path)

  const content = buildContent(frontmatter, markdown)

  const storage = useStorage('content')
  await storage.setItem(contentKey, content)

  try {
    await syncGitContent(commitMessage, [contentKey])
  }
  catch (error) {
    console.error('Git-Fehler:', error)
  }

  return { success: true }
})
