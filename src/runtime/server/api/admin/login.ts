export default defineEventHandler(async (event) => {
  const { mktcms: { authKey } } = useRuntimeConfig()

  const body = await readBody(event)

  if (body.authKey !== authKey) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Set auth_key cookie valid for 7 days
  setCookie(event, 'auth_key', authKey, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  })

  return { message: 'Login successful' }
})
