import { z } from "zod";

const bodySchema = z.object({
  name: z.string(),
  label: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { name, label } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.insertInto('categories').values({ name, label }).execute()

  return { success: true }
})
