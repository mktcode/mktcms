import { defineEventHandler, deleteCookie } from 'h3'
import { ADMIN_AUTH_COOKIE_NAME, getAuthCookieOptions } from '../../utils/authCookie'

export default defineEventHandler(async (event) => {
  deleteCookie(event, ADMIN_AUTH_COOKIE_NAME, getAuthCookieOptions(event))

  event.node.res.writeHead(302, { Location: '/admin/login' })
  event.node.res.end()
})
