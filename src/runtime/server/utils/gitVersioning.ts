import { useRuntimeConfig } from 'nitropack/runtime'
import { simpleGit } from 'simple-git'

export const SUPPORTED_WEBSITE_BRANCHES = ['main', 'staging'] as const

export type WebsiteBranch = typeof SUPPORTED_WEBSITE_BRANCHES[number]

export function isSupportedWebsiteBranch(branch: string): branch is WebsiteBranch {
  return SUPPORTED_WEBSITE_BRANCHES.includes(branch as WebsiteBranch)
}

export function toGitErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error)

  if (/conflict|merge conflict|could not apply|needs merge|merge failed/i.test(message)) {
    return 'Git operation failed due to merge conflicts. Resolve conflicts and retry.'
  }

  if (/authentication failed|could not read username|access denied|permission denied/i.test(message)) {
    return 'Git operation failed due to authentication error. Check NUXT_MKTCMS_GIT_USER, NUXT_MKTCMS_GIT_REPO and NUXT_MKTCMS_GIT_TOKEN.'
  }

  if (/not possible to fast-forward|non-fast-forward|fetch first/i.test(message)) {
    return 'Git operation failed because the target branch cannot be fast-forwarded. Pull and reconcile the branch state first.'
  }

  return `${fallback}: ${message}`
}

type GitClientOptions = {
  baseDir?: string
  authUrlOverride?: string
}

type MergeOptions = GitClientOptions

export function createAuthenticatedGitClient(options: GitClientOptions = {}) {
  const { mktcms: { gitToken, gitUser, gitRepo } } = useRuntimeConfig()

  if (!gitToken || !gitUser || !gitRepo) {
    throw new Error('Missing Git auth config: NUXT_MKTCMS_GIT_USER, NUXT_MKTCMS_GIT_REPO, NUXT_MKTCMS_GIT_TOKEN')
  }

  const git = options.baseDir ? simpleGit({ baseDir: options.baseDir }) : simpleGit()
  git.addConfig('user.name', 'Kunde').addConfig('user.email', 'admin@mktcode.de')

  const authUrl = options.authUrlOverride
    || `https://${encodeURIComponent(gitUser)}:${encodeURIComponent(gitToken)}@github.com/${gitRepo}`

  return { git, authUrl }
}

export async function getCurrentBranchName(options: GitClientOptions = {}) {
  const { git } = createAuthenticatedGitClient(options)
  const branchSummary = await git.branchLocal()
  return branchSummary.current
}

export function getCounterpartBranch(currentBranch: WebsiteBranch): WebsiteBranch {
  return currentBranch === 'main' ? 'staging' : 'main'
}

export async function mergeCounterpartBranchIntoCurrent(options: MergeOptions = {}) {
  const { git, authUrl } = createAuthenticatedGitClient(options)

  const branchSummary = await git.branchLocal()
  const currentBranch = branchSummary.current

  if (!isSupportedWebsiteBranch(currentBranch)) {
    throw new Error(`Unsupported checked-out branch: ${currentBranch}. Expected main or staging.`)
  }

  const sourceBranch = getCounterpartBranch(currentBranch)
  const targetBranch = currentBranch

  const status = await git.status()
  if (!status.isClean()) {
    throw new Error('Cannot merge while working tree has uncommitted changes.')
  }

  try {
    await git.raw(['pull', '--ff-only', authUrl, targetBranch])
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, `Git pull failed for ${targetBranch}`))
  }

  try {
    await git.raw(['fetch', '--prune', authUrl, sourceBranch])
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, `Git fetch failed for ${sourceBranch}`))
  }

  try {
    await git.raw(['merge', '--no-ff', '--no-edit', 'FETCH_HEAD'])
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, `Git merge failed (${sourceBranch} -> ${targetBranch})`))
  }

  try {
    await git.push(authUrl, targetBranch)
  }
  catch (error) {
    throw new Error(toGitErrorMessage(error, `Git push failed for ${targetBranch}`))
  }

  return {
    sourceBranch,
    targetBranch,
  }
}