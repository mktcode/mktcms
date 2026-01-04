import { eq } from 'drizzle-orm'
import { z } from 'zod'
import db from '~~/db'
import { contentTable } from '~~/db/schema'

const routeSchema = z.object({
  slug: z.string(),
})

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, params => routeSchema.parse(params))

  const content = await db.select().from(contentTable).where(eq(contentTable.slug, slug)).limit(1)

  if (content[0] === undefined) {
    throw createError({ statusCode: 404, statusMessage: 'Content not found' })
  }

  return {
    title: content[0].title,
    slug: content[0].slug,
    body: content[0].body,
    date: content[0].date,
    createdAt: content[0].createdAt,
    updatedAt: content[0].updatedAt,
  }
})
