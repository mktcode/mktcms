import { customerFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const customer = await readValidatedBody(event, body => customerFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  if (customer.id) {
    if (await denies(event, manageCustomer, customer.id)) {
      return createError({
        status: 403,
        statusMessage: 'You are not authorized to update this customer.'
      })
    }

    await db.updateTable('customers').set(customer).where('id', '=', customer.id).execute()

    return { success: true, error: null }
  }
  
  await db.insertInto('customers').values({ ...customer, userId: user.id }).execute()
})
