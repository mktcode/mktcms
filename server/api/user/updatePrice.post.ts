import { z } from "zod"

const inputSchema = z.object({
  newPrice: z.number()
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { newPrice } = await readValidatedBody(event, body => inputSchema.parse(body))
  const db = await getDatabaseConnection()

  await db.updateTable('users').set({ price: newPrice }).where('id', '=', user.id).executeTakeFirstOrThrow()
  await setUserSession(event, { user: { ...user, price: newPrice } })

  return { success: true, error: null }
})
