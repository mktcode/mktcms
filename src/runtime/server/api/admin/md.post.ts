import { z } from 'zod'
import { defineEventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { useStorage, useRuntimeConfig } from 'nitropack/runtime'
import { stringify } from 'yaml'
import { simpleGit } from 'simple-git'

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

  const decodedPath = decodeURIComponent(path)

  const content = buildContent(frontmatter, markdown)

  const storage = useStorage('content')
  await storage.setItem(decodedPath, content)

  // Configure git with token authentication
  const { mktcms: { gitToken, gitUser, gitRepo } } = useRuntimeConfig()

  if (!gitToken || !gitUser || !gitRepo) {
    throw new Error('Missing Git auth config: NUXT_MKTCMS_GIT_USER, NUXT_MKTCMS_GIT_REPO, NUXT_MKTCMS_GIT_TOKEN')
  }

  const git = simpleGit()

  git.addConfig('user.name', 'Kunde')
    .addConfig('user.email', 'admin@mktcode.de')

  try {
    await git.add('.')
    await git.commit(commitMessage)

    const authUrl = `https://${encodeURIComponent(gitUser)}:${encodeURIComponent(gitToken)}@github.com/${gitRepo}`
    await git.push([authUrl])
  }
  catch (error) {
    console.error('Git-Fehler:', error)
  }

  return { success: true }
})
