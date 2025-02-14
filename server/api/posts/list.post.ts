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

  const query = db
    .selectFrom('content')
    .select(['id', 'category', 'title', 'description', 'date', 'url', 'image'])
    .orderBy('date', 'desc')
    .limit(limit)
  
  if (category !== 'all') {
    query.where('category', '=', category)
  }

  const posts = await query.execute()
  
  return posts
})
