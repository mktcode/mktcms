import { User } from "#auth-utils";

export const manageCustomer = defineAbility(async (user: User, customerId: number) => {
  const db = await getDatabaseConnection()

  const ownsCustomer = await db
    .selectFrom('customers')
    .innerJoin('users', 'users.id', 'customers.userId')
    .select(({ fn }) => fn.count<number>('customers.id').as('count'))
    .where('customers.id', '=', customerId)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsCustomer.count === 1
})

export const manageInvoice = defineAbility(async (user: User, invoiceId: number) => {
  const db = await getDatabaseConnection()

  const ownsInvoice = await db
    .selectFrom('invoices')
    .innerJoin('customers', 'customers.id', 'invoices.customerId')
    .innerJoin('users', 'users.id', 'customers.userId')
    .select(({ fn }) => fn.count<number>('invoices.id').as('count'))
    .where('invoices.id', '=', invoiceId)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsInvoice.count === 1
})