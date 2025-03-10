import { z } from "zod";
import crypto from 'crypto'

const bodySchema = z.object({
  id: z.number(),
  parentId: z.number().nullable().optional(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })

  try {

    const { id, parentId, title, subtitle, description, url, image, password } = await readValidatedBody(event, body => bodySchema.parse(body))
  
    const db = await getDatabaseConnection()
    const content = await db.selectFrom('contents')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirstOrThrow()
    const project = await db.selectFrom('projects')
      .selectAll()
      .where('id', '=', content.projectId)
      .limit(1)
      .executeTakeFirstOrThrow()
    
    let passByPassword = false
    if (password) {
      const hashedPassword = crypto.pbkdf2Sync(password, '6628c92167a8c334edd9ec6c26c35060', 100000, 64, 'sha512').toString('hex');
      passByPassword = hashedPassword === project.password
    }

    if (!passByPassword && await denies(event, manageProject, content.projectId)) {
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
      
      if (parent.projectId !== content.projectId) {
        return createError({
          status: 403,
          statusMessage: 'Parent content does not belong to the same project.'
        })
      }
    }
    
    await db.updateTable('contents').set({ parentId, title, subtitle, description, url, image }).where('id', '=', id).execute()
  } catch (error) {
    console.error(error)
  }
})
