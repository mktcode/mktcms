import { z } from "zod";

const bodySchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().optional(),
  url: z.string(),
  image: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { category, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.query(`INSERT INTO content (category, title, description, date, url, image) VALUES (?, ?, ?, ?, ?, ?)`, [category, title, description, date, url, image])
  return { success: true }
})
