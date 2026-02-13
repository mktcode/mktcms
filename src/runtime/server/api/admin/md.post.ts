import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { stringify } from 'yaml'
import { simpleGit } from 'simple-git'

const querySchema = z.object({
  path: z.string().min(1),
})

const bodySchema = z.object({
  frontmatter: z.record(z.string(), z.any()),
  markdown: z.string(),
  commitMessage: z.string().optional(),
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

  const decodedPath = decodeURIComponent(path)

  const content = buildContent(frontmatter, markdown)

  const storage = useStorage('content')
  await storage.setItem(decodedPath, content)

  const git = simpleGit({
    config: ['user.name=Kunde', 'user.email=admin@mktcode.de'],
  })
  await git.add('.')
  await git.commit(commitMessage || `Änderung durch Kunden`)

  return { success: true }
})
