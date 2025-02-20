export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['profile', 'https://www.googleapis.com/auth/business.manage'],
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user,
      secure: {
        token: tokens.access_token,
      }
    })
    return sendRedirect(event, '/mktcms')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/mktcms')
  },
})