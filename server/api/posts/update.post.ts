import { z } from "zod";

const bodySchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().nullable(),
  url: z.string(),
  image: z.string().nullable(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id, category, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.updateTable('content').set({ category, title, description, date, url, image }).where('id', '=', Number(id)).execute()
})
