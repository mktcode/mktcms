import { describe, expect, it, vi } from 'vitest'

import { assertUploadSize, getMaxUploadBytes } from '../../../../../src/runtime/server/utils/uploadGuard'

vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: () => ({
    mktcms: {
      uploadMaxBytes: 1024,
    },
  }),
}))

describe('uploadGuard', () => {
  it('reads max upload size from runtime config', () => {
    expect(getMaxUploadBytes()).toBe(1024)
  })

  it('accepts payloads at or below limit', () => {
    expect(() => assertUploadSize(Buffer.alloc(1024), 1024)).not.toThrow()
    expect(() => assertUploadSize('1234', 4)).not.toThrow()
  })

  it('rejects payloads above limit with 413', () => {
    expect(() => assertUploadSize(Buffer.alloc(1025), 1024)).toThrowError(/Upload too large/)
  })
})
