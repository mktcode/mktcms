import { z } from "zod";

const bodySchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().nullable(),
  url: z.string(),
  image: z.string().nullable(),
  categories: z.array(z.number())
})

function slugFromTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  
  const db = await getDatabaseConnection()
  const { categories, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  const slug = slugFromTitle(title)

  const result = await db.insertInto('contents').values({ title, slug, description, date, url, image }).returning('id').executeTakeFirstOrThrow()
  
  await db.deleteFrom('contentCategories').where('contentId', '=', result.id).execute()
  await db.insertInto('contentCategories').values(categories.map(categoryId => ({ contentId: result.id, categoryId }))).execute()

  return { success: true }
})
