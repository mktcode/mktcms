import { describe, expect, it } from 'vitest'
import { toGitErrorMessage } from '../../../../../src/runtime/server/utils/gitErrorSanitization'

describe('git error sanitization', () => {
  it('returns fallback for unknown errors instead of raw message', () => {
    const error = new Error('fatal: unexpected internal state at /tmp/repo')
    expect(toGitErrorMessage(error, 'Failed to update branch')).toBe('Failed to update branch')
  })

  it('maps known auth errors to safe generic message', () => {
    const error = new Error('fatal: Authentication failed for https://user:secret@github.com/org/repo')
    expect(toGitErrorMessage(error, 'Failed to update branch')).toContain('authentication error')
    expect(toGitErrorMessage(error, 'Failed to update branch')).not.toContain('secret')
  })

  it('maps merge conflict errors to safe generic message', () => {
    const error = new Error('CONFLICT (content): Merge conflict in file.md')
    expect(toGitErrorMessage(error, 'Failed to update branch')).toContain('merge conflicts')
  })
})
