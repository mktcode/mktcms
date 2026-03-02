import { describe, expect, it, vi } from 'vitest'

vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: () => ({
    mktcms: {
      authCookieMaxAgeSeconds: 3600,
      authCookiePath: '/',
      authCookieSameSite: 'strict',
      authCookieSecure: true,
    },
  }),
}))

import { ADMIN_AUTH_COOKIE_NAME, getAuthCookieOptions } from '../../../../../src/runtime/server/utils/authCookie'

describe('authCookie', () => {
  it('returns hardened auth cookie options from runtime config', () => {
    const options = getAuthCookieOptions({} as any)

    expect(ADMIN_AUTH_COOKIE_NAME).toBe('mktcms_admin_auth_key')
    expect(options).toEqual({
      httpOnly: true,
      maxAge: 3600,
      path: '/',
      sameSite: 'strict',
      secure: true,
    })
  })
})
