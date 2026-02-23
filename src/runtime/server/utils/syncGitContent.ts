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
    await git.raw([...gitBotIdentityArgs(), 'commit', '-m', commitMessage])
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

  try {
    const currentBranch = (await git.branchLocal()).current
    const remotes = await git.getRemotes(true)
    const hasOriginRemote = remotes.some(remote => remote.name === 'origin')

    if (hasOriginRemote) {
      await git.fetch(['--prune', 'origin', currentBranch])
    }
  }
  catch {
  }
}
