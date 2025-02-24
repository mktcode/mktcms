import { z } from "zod";

const bodySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  categories: z.array(z.number()).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  
  const db = await getDatabaseConnection()
  const { id, categories, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.updateTable('contents').set({ title, description, date, url, image }).where('id', '=', Number(id)).execute()

  if (categories && categories.length > 0) {
    await db.deleteFrom('contentCategories').where('contentId', '=', Number(id)).execute()
    await db.insertInto('contentCategories').values(categories.map(categoryId => ({ contentId: Number(id), categoryId }))).execute()
  }
})
