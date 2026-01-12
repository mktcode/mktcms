import { useRuntimeConfig } from 'nitropack/runtime'
import { createError, defineEventHandler, readValidatedBody, setCookie } from 'h3'
import z from 'zod'

const bodySchema = z.object({
  adminAuthKey: z.string(),
})

export default defineEventHandler(async (event) => {
  const { mktcms: { adminAuthKey } } = useRuntimeConfig()

  const body = await readValidatedBody(event, body => bodySchema.parse(body))

  if (body.adminAuthKey !== adminAuthKey.toString()) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  setCookie(event, 'mktcms_admin_auth_key', adminAuthKey.toString(), {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
  })

  return { message: 'Login successful' }
})
