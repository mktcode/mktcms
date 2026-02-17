import { useRuntimeConfig } from 'nitropack/runtime'
import { simpleGit } from 'simple-git'

function toStorageFilePath(file: string) {
  const normalized = file
    .replace(/\\/g, '/')
    .replace(/:/g, '/')
    .replace(/^\/+/, '')
    .replace(/^\.\/+/, '')

  const withoutBase = normalized.startsWith('.storage/')
    ? normalized.slice('.storage/'.length)
    : normalized

  const safePath = withoutBase
    .split('/')
    .filter(segment => segment && segment !== '.' && segment !== '..')
    .join('/')

  if (!safePath) {
    throw new Error('Invalid file path for Git sync')
  }

  return `.storage/${safePath}`
}

export default async function syncGitContent(commitMessage: string, files: string[]) {
  const { mktcms: { gitToken, gitUser, gitRepo } } = useRuntimeConfig()

  if (!gitToken || !gitUser || !gitRepo) {
    throw new Error('Missing Git auth config: NUXT_MKTCMS_GIT_USER, NUXT_MKTCMS_GIT_REPO, NUXT_MKTCMS_GIT_TOKEN')
  }

  const git = simpleGit()
  git.addConfig('user.name', 'Kunde').addConfig('user.email', 'admin@mktcode.de')

  const filesToAdd = [...new Set(files.map(toStorageFilePath))]

  await git.add(filesToAdd)
  await git.commit(commitMessage)

  const authUrl = `https://${encodeURIComponent(gitUser)}:${encodeURIComponent(gitToken)}@github.com/${gitRepo}`
  await git.push([authUrl])
}