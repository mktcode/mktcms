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

export const manageCustomer = defineAbility(async (user: User, customerId: number) => {
  const db = await getDatabaseConnection()

  const ownsCustomer = await db
    .selectFrom('customers')
    .innerJoin('projects', 'projects.id', 'customers.projectId')
    .select(({ fn }) => fn.count<number>('customers.id').as('count'))
    .where('customers.id', '=', customerId)
    .where('projects.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsCustomer.count === 1
})

export const manageInvoice = defineAbility(async (user: User, invoiceId: number) => {
  const db = await getDatabaseConnection()

  const ownsInvoice = await db
    .selectFrom('invoices')
    .innerJoin('customers', 'customers.id', 'invoices.customerId')
    .innerJoin('projects', 'projects.id', 'customers.projectId')
    .select(({ fn }) => fn.count<number>('invoices.id').as('count'))
    .where('invoices.id', '=', invoiceId)
    .where('projects.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsInvoice.count === 1
})