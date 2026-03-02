import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: () => ({
    mktcms: {
      loginRateLimitMaxAttempts: 2,
      loginRateLimitWindowSeconds: 60,
      loginRateLimitBlockSeconds: 120,
    },
  }),
}))

vi.mock('h3', async () => {
  const actual = await vi.importActual<any>('h3')
  return {
    ...actual,
    getRequestIP: () => '127.0.0.1',
  }
})

import {
  assertLoginNotRateLimited,
  clearFailedLoginAttempts,
  recordFailedLoginAttempt,
} from '../../../../../src/runtime/server/utils/loginRateLimit'

describe('loginRateLimit', () => {
  beforeEach(() => {
    clearFailedLoginAttempts({} as any)
  })

  it('allows login attempts before threshold', () => {
    expect(() => assertLoginNotRateLimited({} as any)).not.toThrow()
    recordFailedLoginAttempt({} as any)
    expect(() => assertLoginNotRateLimited({} as any)).not.toThrow()
  })

  it('blocks after configured max failures', () => {
    recordFailedLoginAttempt({} as any)
    recordFailedLoginAttempt({} as any)

    expect(() => assertLoginNotRateLimited({} as any)).toThrowError(/Too many login attempts/)
  })

  it('clears block state for client when requested', () => {
    recordFailedLoginAttempt({} as any)
    recordFailedLoginAttempt({} as any)
    expect(() => assertLoginNotRateLimited({} as any)).toThrow()

    clearFailedLoginAttempts({} as any)
    expect(() => assertLoginNotRateLimited({} as any)).not.toThrow()
  })
})
