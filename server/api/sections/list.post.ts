import { z } from "zod";

const bodySchema = z.object({
  route: z.string().nullable(),
  categoryId: z.number().nullable(),
  isDetailsPage: z.boolean().nullable(),
}).default({
  route: null,
  categoryId: null,
  isDetailsPage: false,
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { route, categoryId, isDetailsPage } = await readValidatedBody(event, body => bodySchema.parse(body))

  let query = db
    .selectFrom('sections')
    .select([
      'id',
      'name',
      'route',
      'categoryId',
      'isDetailsPage',
      'component',
      'orderIndex',
    ])
  
  if (route === null) {
    query = query.where('route', 'is', null)
  } else {
    query = query.where('route', '=', route)
  }

  if (categoryId === null) {
    query = query.where('categoryId', 'is', null)
  } else {
    query = query.where('categoryId', '=', categoryId)
  }
  
  query = query
    .where('isDetailsPage', '=', Number(isDetailsPage))
    .orderBy('orderIndex', 'asc')

  const sections = await query.execute()
  
  return sections
})
