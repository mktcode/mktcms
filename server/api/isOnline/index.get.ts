import { z } from "zod";

const querySchema = z.object({
  userId: z.string()
})

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })

  const { userId } = await getValidatedQuery(event, querySchema.parse);

  const db = await getDatabaseConnection()
  const user = await db.selectFrom('users')
    .select(['isOnline'])
    .where('id', '=', Number(userId))
    .limit(1)
    .executeTakeFirst()

  if (!user) {
    return false
  }

  return user.isOnline
})
