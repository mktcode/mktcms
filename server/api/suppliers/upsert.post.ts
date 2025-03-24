import { supplierFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const supplier = await readValidatedBody(event, body => supplierFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  if (supplier.id) {
    if (await denies(event, manageSupplier, supplier.id)) {
      throw createError({
        status: 403,
        statusMessage: 'You are not authorized to update this supplier.'
      })
    }

    const result = await db.updateTable('suppliers').set(supplier).where('id', '=', supplier.id).executeTakeFirst()

    if (!result) {
      throw createError({
        status: 404,
        statusMessage: 'Supplier not found.'
      })
    }

    return { success: true, error: null, supplierId: supplier.id }
  }
  
  const result = await db.insertInto('suppliers').values({ ...supplier, userId: user.id }).executeTakeFirst()

  if (!result.insertId) {
    throw createError({
      status: 404,
      statusMessage: 'Supplier not inserted.'
    })
  }

  return { success: true, error: null, supplierId: Number(result.insertId) }
})
