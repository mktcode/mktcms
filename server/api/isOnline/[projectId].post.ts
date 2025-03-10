import { z } from "zod";
import crypto from 'crypto'

const routeSchema = z.object({
  projectId: z.string()
})

const bodySchema = z.object({
  isOnline: z.boolean(),
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

    const { projectId } = await getValidatedRouterParams(event, routeSchema.parse)
    const { isOnline, password } = await readValidatedBody(event, bodySchema.parse)
  
    const db = await getDatabaseConnection()
    const project = await db.selectFrom('projects')
      .selectAll()
      .where('id', '=', Number(projectId))
      .limit(1)
      .executeTakeFirstOrThrow()
    
    let passByPassword = false
    if (password) {
      const hashedPassword = crypto.pbkdf2Sync(password, '6628c92167a8c334edd9ec6c26c35060', 100000, 64, 'sha512').toString('hex');
      passByPassword = hashedPassword === project.password
    }

    if (!passByPassword && await denies(event, manageProject, Number(projectId))) {
      return createError({
        status: 403,
        statusMessage: 'You are not authorized to update this content.'
      })
    }
    
    await db.updateTable('projects').set({ isOnline }).where('id', '=', Number(projectId)).execute()
  } catch (error) {
    console.error(error)
  }
})
