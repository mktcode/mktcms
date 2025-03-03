import { z } from "zod";

const bodySchema = z.object({
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
  const { categories, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  const result = await db.insertInto('contents').values({ title, description, date, url, image }).returning('id').executeTakeFirstOrThrow()
  
  if (categories && categories.length > 0) {
    await db.insertInto('contentCategories').values(categories.map(categoryId => ({ contentId: result.id, categoryId }))).execute()
  }

  return result
})
