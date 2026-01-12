import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'mktcms_admin_auth_key')

  event.node.res.writeHead(302, { Location: '/admin/login' })
  event.node.res.end()
})
