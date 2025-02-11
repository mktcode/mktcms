import { z } from "zod";

const bodySchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  url: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { category, title, description, date, url } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.query(`INSERT INTO content (category, title, description, date, url) VALUES (?, ?, ?, ?, ?)`, [category, title, description, date, url])
  return { success: true }
})
