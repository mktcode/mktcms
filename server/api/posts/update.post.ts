import { z } from "zod";

const bodySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().optional(),
  url: z.string(),
  image: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.query(`UPDATE content SET title = ?, description = ?, date = ?, url = ?, image = ? WHERE id = ?`, [title, description, date, url, image, id])
})
