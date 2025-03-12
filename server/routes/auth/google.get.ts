export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['profile', 'https://www.googleapis.com/auth/business.manage'],
  },
  async onSuccess(event, { user, tokens }) {
    const db = await getDatabaseConnection()

    const existingUser = await db
      .selectFrom('users')
      .select(['id', 'domain'])
      .where('googleManagerId', '=', user.sub)
      .executeTakeFirstOrThrow()

    await setUserSession(event, {
      user: {
        ...user,
        id: existingUser.id,
        domain: existingUser.domain,
        googleId: user.sub,
      },
      secure: {
        token: tokens.access_token,
      }
    })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/')
  },
})