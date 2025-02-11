import { z } from "zod";

const bodySchema = z.object({
  id: z.number()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.query(`DELETE FROM content WHERE id = ${id}`)
  return { success: true }
})
