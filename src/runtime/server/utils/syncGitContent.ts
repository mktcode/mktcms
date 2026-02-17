import { useRuntimeConfig } from 'nitropack/runtime'
import { simpleGit } from 'simple-git'

export default async function syncGitContent(commitMessage: string) {
  const { mktcms: { gitToken, gitUser, gitRepo } } = useRuntimeConfig()

  if (!gitToken || !gitUser || !gitRepo) {
    throw new Error('Missing Git auth config: NUXT_MKTCMS_GIT_USER, NUXT_MKTCMS_GIT_REPO, NUXT_MKTCMS_GIT_TOKEN')
  }

  const git = simpleGit()
  git.addConfig('user.name', 'Kunde').addConfig('user.email', 'admin@mktcode.de')

  await git.add('.')
  await git.commit(commitMessage)

  const authUrl = `https://${encodeURIComponent(gitUser)}:${encodeURIComponent(gitToken)}@github.com/${gitRepo}`
  await git.push([authUrl])
}