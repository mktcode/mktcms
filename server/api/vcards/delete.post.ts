import { z } from "zod"

export const bodySchema = z.object({
  id: z.number(),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, body => bodySchema.parse(body))
  const db = await getDatabaseConnection()

  if (await denies(event, manageVcard, id)) {
    return createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, diese Visitenkarte zu löschen.'
    })
  }

  await db.deleteFrom('vcards').where('id', '=', id).execute()

  return { success: true, error: null }
})
