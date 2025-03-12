import { z } from "zod";
import crypto from 'crypto'

const bodySchema = z.object({
  isOnline: z.boolean(),
  password: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })

  const { isOnline, password } = await readValidatedBody(event, bodySchema.parse)
  const db = await getDatabaseConnection()
  const { user: userBySession } = await getUserSession(event)

  if (userBySession) {
    await db.updateTable('users').set({ isOnline }).where('id', '=', userBySession.id).execute()

    return { success: true, error: null }
  }

  if (password) {
    const hashedPassword = crypto.pbkdf2Sync(password, '6628c92167a8c334edd9ec6c26c35060', 100000, 64, 'sha512').toString('hex');
    const userByPassword = await db.selectFrom('users').selectAll().where('password', '=', hashedPassword).executeTakeFirst()
    
    if (userByPassword) {
      await db.updateTable('users').set({ isOnline }).where('id', '=', userByPassword.id).execute()

      return { success: true, error: null }
    }
  }

  return createError({
    status: 403,
    statusMessage: 'You are not authorized to update this user.'
  })
})
