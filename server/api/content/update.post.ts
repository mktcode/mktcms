import { z } from "zod";

const bodySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().nullable(),
  url: z.string(),
  image: z.string().nullable(),
  categories: z.array(z.number()),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id, categories, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.updateTable('contents').set({ title, description, date, url, image }).where('id', '=', Number(id)).execute()
  await db.deleteFrom('contentCategories').where('contentId', '=', Number(id)).execute()
  await db.insertInto('contentCategories').values(categories.map(categoryId => ({ contentId: Number(id), categoryId }))).execute()
})
