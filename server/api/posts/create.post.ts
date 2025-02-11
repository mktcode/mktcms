import { z } from "zod";

const bodySchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  url: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { title, description, date, url } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.query(`INSERT INTO content (title, description, date, url) VALUES (?, ?, ?, ?)`, [title, description, date, url])
  return { success: true }
})
