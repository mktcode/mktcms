import { z } from "zod";

const bodySchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().nullable(),
  url: z.string(),
  image: z.string().nullable(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { category, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.insertInto('content').values({ category, title, description, date, url, image }).execute()
  return { success: true }
})
