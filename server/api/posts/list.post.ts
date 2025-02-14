import { z } from "zod";

const bodySchema = z.object({
  category: z.string().default('all'),
  limit: z.number().default(999)
}).default({
  category: 'all',
  limit: 999
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { category, limit } = await readValidatedBody(event, body => bodySchema.parse(body))

  let query = db
    .selectFrom('content')
    .select(['id', 'category', 'title', 'description', 'date', 'url', 'image'])
  
  if (category !== 'all') {
    query = query.where('category', '=', category)
  }

  query = query
    .orderBy('date', 'desc')
    .limit(limit)

  const posts = await query.execute()
  
  return posts
})
