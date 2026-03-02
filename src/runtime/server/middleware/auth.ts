import { useRuntimeConfig } from 'nitropack/runtime'
import { createError, defineEventHandler, getCookie, getRequestURL, sendRedirect } from 'h3'
import { ADMIN_AUTH_COOKIE_NAME } from '../utils/authCookie'

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname

  const isAdminLoginRoute = pathname === '/admin/login' || pathname === '/api/admin/login'
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminApiRoute = pathname === '/api/admin' || pathname.startsWith('/api/admin/')
  if (isAdminLoginRoute || (!isAdminRoute && !isAdminApiRoute)) return

  const { mktcms: { adminAuthKey } } = useRuntimeConfig()

  const authKeyCookie = getCookie(event, ADMIN_AUTH_COOKIE_NAME)

  if (!authKeyCookie || authKeyCookie !== adminAuthKey.toString() || adminAuthKey === '') {
    if (isAdminApiRoute) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    else {
      return sendRedirect(event, '/admin/login')
    }
  }
})
