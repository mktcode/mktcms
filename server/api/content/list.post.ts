import { z } from "zod";

const bodySchema = z.object({
  categories: z.array(z.number()).default([]),
  limit: z.number().default(999)
}).default({
  categories: [],
  limit: 999
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { categories, limit } = await readValidatedBody(event, body => bodySchema.parse(body))

  const query = db
    .selectFrom('contents')
    .select([
      'id',
      'title',
      'subtitle',
      'description',
      'date',
      'url',
      'image',
    ])
    .where('contents.id', 'in', db.selectFrom('contentCategories').select('contentId').where('contentCategories.categoryId', 'in', categories))
    .orderBy('date', 'desc')
    .limit(limit)

  const contents = await query.execute()

  const contentsWithCategories = await Promise.all(contents.map(async content => {
    const categories = await db.selectFrom('categories')
      .select(['id', 'name', 'label'])
      .where('categories.id', 'in', db.selectFrom('contentCategories').select('categoryId').where('contentCategories.contentId', '=', content.id))
      .execute()

    return { ...content, categories }
  }))
  
  return contentsWithCategories
})
