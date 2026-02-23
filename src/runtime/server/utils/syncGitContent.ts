import { createAuthenticatedGitClient, gitBotIdentityArgs, toGitErrorMessage } from './gitVersioning'

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
  const { git, authUrl } = createAuthenticatedGitClient()
  const currentBranch = (await git.branchLocal()).current

  try {
    await git.raw(['pull', '--rebase', '--autostash', authUrl, currentBranch])
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
    await git.raw([...gitBotIdentityArgs(), 'commit', '-m', commitMessage])
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, 'Git commit failed'))
  }

  try {
    await git.push([authUrl, `HEAD:${currentBranch}`])
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, 'Git push failed'))
  }

  try {
    const remotes = await git.getRemotes(true)
    const hasOriginRemote = remotes.some(remote => remote.name === 'origin')

    if (hasOriginRemote) {
      await git.raw(['update-ref', `refs/remotes/origin/${currentBranch}`, 'HEAD'])
    }
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, 'Git status refresh failed'))
  }
}
