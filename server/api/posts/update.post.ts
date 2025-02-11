import { z } from "zod";

const bodySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  url: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id, title, description, date, url } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.query(`UPDATE content SET title = ?, description = ?, date = ?, url = ? WHERE id = ?`, [title, description, date, url, id])
})
