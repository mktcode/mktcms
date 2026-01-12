import { useRuntimeConfig } from 'nitropack/runtime'
import { createError, defineEventHandler, getCookie, getRequestURL, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname

  const isAdminLoginRoute = pathname === '/admin/login' || pathname === '/api/admin/login'
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminApiRoute = pathname === '/api/admin' || pathname.startsWith('/api/admin/')
  if (isAdminLoginRoute || (!isAdminRoute && !isAdminApiRoute)) return

  const { mktcms: { adminAuthKey } } = useRuntimeConfig()

  const authKeyCookie = getCookie(event, 'mktcms_admin_auth_key')

  if (!authKeyCookie || authKeyCookie !== adminAuthKey.toString() || adminAuthKey === '') {
    if (isAdminApiRoute) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    else {
      return sendRedirect(event, '/admin/login')
    }
  }
})
