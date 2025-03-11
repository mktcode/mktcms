import { CustomerFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const customer = await readValidatedBody(event, body => CustomerFormSchema.parse(body))
    const db = await getDatabaseConnection()

    if (await denies(event, manageProject, customer.projectId)) {
      return createError({
        status: 403,
        statusMessage: 'You are not authorized to update this content.'
      })
    }
    
    if (customer.id) {
      const existingCustomer = await db.selectFrom('customers').select(['projectId']).where('id', '=', customer.id).executeTakeFirstOrThrow()
      if (existingCustomer.projectId !== customer.projectId) {
        return createError({
          status: 400,
          statusMessage: 'Customer does not belong to the project.'
        })
      }
      await db.updateTable('customers').set(customer).where('id', '=', customer.id).execute()
      return
    } else {
      await db.insertInto('customers').values(customer).execute()
    }
  } catch (error) {
    console.error(error)
  }
})
