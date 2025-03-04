import { z } from "zod";

const bodySchema = z.object({
  id: z.number(),
  parentId: z.number().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const { id, parentId, title, description, date, url, image } = await readValidatedBody(event, body => bodySchema.parse(body))

  const db = await getDatabaseConnection()
  const content = await db.selectFrom('contents')
    .selectAll()
    .where('id', '=', id)
    .limit(1)
    .executeTakeFirstOrThrow()
  
  if (await denies(event, manageProject, content.projectId)) {
    return createError({
      status: 403,
      statusMessage: 'You are not authorized to update this content.'
    })
  }
  
  if (parentId) {
    const parent = await db.selectFrom('contents')
      .selectAll()
      .where('id', '=', parentId)
      .limit(1)
      .executeTakeFirstOrThrow()
    
    if (await denies(event, manageProject, parent.projectId)) {
      return createError({
        status: 403,
        statusMessage: 'You are not authorized to set this content as a child of the specified parent.'
      })
    }
  }
  
  await db.updateTable('contents').set({ parentId, title, description, date, url, image }).where('id', '=', id).execute()
})
