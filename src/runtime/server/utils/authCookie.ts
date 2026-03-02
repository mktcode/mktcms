import type { H3Event } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

export const ADMIN_AUTH_COOKIE_NAME = 'mktcms_admin_auth_key'

export function getAuthCookieOptions(event: H3Event) {
  const { mktcms: { authCookieMaxAgeSeconds, authCookiePath, authCookieSameSite, authCookieSecure } } = useRuntimeConfig(event)

  return {
    httpOnly: true,
    maxAge: Number(authCookieMaxAgeSeconds) || 7 * 24 * 60 * 60,
    path: authCookiePath || '/',
    sameSite: (authCookieSameSite || 'lax') as 'lax' | 'strict' | 'none',
    secure: Boolean(authCookieSecure),
  }
}
