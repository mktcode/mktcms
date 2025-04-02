export default defineOAuthGoogleEventHandler({
  config: {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
  },
  async onSuccess(event, { user, tokens }) {
    const db = await getDatabaseConnection()

    const existingUser = await db
      .selectFrom('users')
      .select(['id', 'domain', 'email', 'balance', 'price'])
      .where('googleManagerId', '=', user.sub)
      .executeTakeFirst()

    if (existingUser) {
      await setUserSession(event, {
        user: {
          ...user,
          id: existingUser.id,
          domain: existingUser.domain,
          email: existingUser.email,
          balance: existingUser.balance,
          price: Number(existingUser.price),
          googleId: user.sub,
        },
        secure: {
          token: tokens.access_token,
        }
      })
    } else {
      const insertResult = await db.insertInto('users')
        .values({
          name: user.name,
          googleManagerId: user.sub,
          email: user.email,
          balance: 0,
          price: 1,
        })
        .executeTakeFirstOrThrow()
      
        
      if (!insertResult.insertId) {
        throw new Error('Failed to insert user')
      }

      const newUserId = Number(insertResult.insertId.toString())
        
      await insertDefaultsAfterSignup(newUserId)

      await setUserSession(event, {
        user: {
          ...user,
          id: newUserId,
          domain: null,
          googleId: user.sub,
          balance: 0,
          price: 1,
        },
        secure: {
          token: tokens.access_token,
        }
      })
    }

    return sendRedirect(event, '/einstellungen')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/')
  },
})