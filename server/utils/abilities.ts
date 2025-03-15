import { User } from "#auth-utils";

export const manageWebsite = defineAbility(async (user: User, websiteId: number) => {
  const db = await getDatabaseConnection()

  const ownsWebsite = await db
    .selectFrom('websites')
    .innerJoin('users', 'users.id', 'websites.userId')
    .select(({ fn }) => fn.count<number>('websites.id').as('count'))
    .where('websites.id', '=', websiteId)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()

  return ownsWebsite.count === 1
})

export const manageVcard = defineAbility(async (user: User, vcardId: number) => {
  const db = await getDatabaseConnection()

  const ownsVcard = await db
    .selectFrom('vcards')
    .innerJoin('users', 'users.id', 'vcards.userId')
    .select(({ fn }) => fn.count<number>('vcards.id').as('count'))
    .where('vcards.id', '=', vcardId)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()

  return ownsVcard.count === 1
})

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

export const manageSupplier = defineAbility(async (user: User, supplierId: number) => {
  const db = await getDatabaseConnection()

  const ownsSupplier = await db
    .selectFrom('suppliers')
    .innerJoin('users', 'users.id', 'suppliers.userId')
    .select(({ fn }) => fn.count<number>('suppliers.id').as('count'))
    .where('suppliers.id', '=', supplierId)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()

  return ownsSupplier.count === 1
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