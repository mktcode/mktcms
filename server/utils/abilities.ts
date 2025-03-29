import { User } from "#auth-utils";

export const manageContactFormMessage = defineAbility(async (user: User, messageId: number) => {
  const db = await getDatabaseConnection()

  const ownsMessage = await db
    .selectFrom('contactFormMessages')
    .innerJoin('websites', 'websites.id', 'contactFormMessages.websiteId')
    .select(({ fn }) => fn.count<number>('contactFormMessages.id').as('count'))
    .where('contactFormMessages.id', '=', messageId)
    .where('websites.userId', '=', user.id)
    .executeTakeFirstOrThrow()
  
  return ownsMessage.count === 1
})

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

export const manageDomain = defineAbility(async (user: User, domainId: number) => {
  const db = await getDatabaseConnection()

  const ownsDomain = await db
    .selectFrom('domains')
    .innerJoin('users', 'users.id', 'domains.userId')
    .select(({ fn }) => fn.count<number>('domains.id').as('count'))
    .where('domains.id', '=', domainId)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsDomain.count === 1
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

export const manageInvoiceItem = defineAbility(async (user: User, invoiceItemid: number) => {
  const db = await getDatabaseConnection()

  const ownsinvoiceItem = await db
    .selectFrom('invoiceItems')
    .innerJoin('users', 'users.id', 'invoiceItems.userId')
    .select(({ fn }) => fn.count<number>('invoiceItems.id').as('count'))
    .where('invoiceItems.id', '=', invoiceItemid)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsinvoiceItem.count === 1
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

export const manageInvoiceOut = defineAbility(async (user: User, invoiceId: number) => {
  const db = await getDatabaseConnection()

  const ownsInvoice = await db
    .selectFrom('invoicesOut')
    .innerJoin('customers', 'customers.id', 'invoicesOut.customerId')
    .innerJoin('users', 'users.id', 'customers.userId')
    .select(({ fn }) => fn.count<number>('invoicesOut.id').as('count'))
    .where('invoicesOut.id', '=', invoiceId)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsInvoice.count === 1
})

export const manageInvoiceIn = defineAbility(async (user: User, invoiceId: number) => {
  const db = await getDatabaseConnection()

  const ownsInvoice = await db
    .selectFrom('invoicesIn')
    .innerJoin('suppliers', 'suppliers.id', 'invoicesIn.supplierId')
    .innerJoin('users', 'users.id', 'suppliers.userId')
    .select(({ fn }) => fn.count<number>('invoicesIn.id').as('count'))
    .where('invoicesIn.id', '=', invoiceId)
    .where('users.googleManagerId', '=', user.googleId)
    .executeTakeFirstOrThrow()
  
  return ownsInvoice.count === 1
})