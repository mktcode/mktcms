import { useRuntimeConfig } from 'nitropack/runtime'
import { simpleGit } from 'simple-git'

function toGitErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error)

  if (/conflict|merge conflict|could not apply|needs merge/i.test(message)) {
    return 'Git sync failed due to merge conflicts during pull --rebase. Resolve conflicts and retry.'
  }

  if (/authentication failed|could not read username|access denied|permission denied/i.test(message)) {
    return 'Git sync failed due to authentication error. Check NUXT_MKTCMS_GIT_USER, NUXT_MKTCMS_GIT_REPO and NUXT_MKTCMS_GIT_TOKEN.'
  }

  return `${fallback}: ${message}`
}

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

  const authUrl = `https://${encodeURIComponent(gitUser)}:${encodeURIComponent(gitToken)}@github.com/${gitRepo}`

  try {
    await git.raw(['pull', '--rebase', '--autostash', authUrl])
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, 'Git pull failed'))
  }

  const filesToAdd = [...new Set(files.map(toStorageFilePath))]

  await git.add(filesToAdd)

  const status = await git.status()
  if (status.staged.length === 0) {
    return
  }

  try {
    await git.commit(commitMessage)
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, 'Git commit failed'))
  }

  try {
    await git.push([authUrl])
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, 'Git push failed'))
  }
}
