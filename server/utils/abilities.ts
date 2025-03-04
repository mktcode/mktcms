import { User } from "#auth-utils"

export const manageProject = defineAbility(async (user: User, projectId: number) => { 
  const db = await getDatabaseConnection()

  const ownsProject = await db.selectFrom('projects')
    .select(({ fn }) => fn.count<number>('id').as('count'))
    .where('id', '=', projectId)
    .where('googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsProject.count === 1
})