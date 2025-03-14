import { supplierFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const supplier = await readValidatedBody(event, body => supplierFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  if (supplier.id) {
    if (await denies(event, manageSupplier, supplier.id)) {
      return createError({
        status: 403,
        statusMessage: 'You are not authorized to update this supplier.'
      })
    }

    await db.updateTable('suppliers').set(supplier).where('id', '=', supplier.id).execute()

    return { success: true, error: null }
  }
  
  await db.insertInto('suppliers').values({ ...supplier, userId: user.id }).execute()

  return { success: true, error: null }
})
