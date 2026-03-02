export function toGitErrorMessage(error: unknown, fallback: string) {
  const rawMessage = error instanceof Error ? error.message : String(error)
  const message = rawMessage
    .replace(/https?:\/\/[^\s@]+@/gi, 'https://***@')
    .replace(/(ghp_[A-Za-z0-9]+)/g, '***')
    .replace(/(github_pat_\w+)/g, '***')
    .replace(/(token=)[^&\s]+/gi, '$1***')
    .replace(/(x-access-token:)[^@\s]+/gi, '$1***')

  if (/conflict|merge conflict|could not apply|needs merge|merge failed/i.test(message)) {
    return 'Git operation failed due to merge conflicts. Resolve conflicts and retry.'
  }

  if (/authentication failed|could not read username|access denied|permission denied/i.test(message)) {
    return 'Git operation failed due to authentication error. Check NUXT_MKTCMS_GIT_USER, NUXT_MKTCMS_GIT_REPO and NUXT_MKTCMS_GIT_TOKEN.'
  }

  if (/not possible to fast-forward|non-fast-forward|fetch first/i.test(message)) {
    return 'Git operation failed because the target branch cannot be fast-forwarded. Pull and reconcile the branch state first.'
  }

  if (/timed out|network is unreachable|could not resolve host|econnreset|econnrefused|etimedout/i.test(message)) {
    return 'Git operation failed due to a network error. Please retry.'
  }

  return fallback
}
