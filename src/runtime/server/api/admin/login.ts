import { useRuntimeConfig } from 'nitropack/runtime'
import { createError, defineEventHandler, readValidatedBody, setCookie } from 'h3'
import z from 'zod'
import { ADMIN_AUTH_COOKIE_NAME, getAuthCookieOptions } from '../../utils/authCookie'
import { assertLoginNotRateLimited, clearFailedLoginAttempts, recordFailedLoginAttempt } from '../../utils/loginRateLimit'

const bodySchema = z.object({
  adminAuthKey: z.string(),
})

export default defineEventHandler(async (event) => {
  const { mktcms: { adminAuthKey } } = useRuntimeConfig()
  assertLoginNotRateLimited(event)

  const body = await readValidatedBody(event, body => bodySchema.parse(body))

  if (body.adminAuthKey !== adminAuthKey.toString()) {
    recordFailedLoginAttempt(event)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  clearFailedLoginAttempts(event)

  setCookie(event, ADMIN_AUTH_COOKIE_NAME, adminAuthKey.toString(), getAuthCookieOptions(event))

  return { message: 'Login successful' }
})
