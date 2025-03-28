import { z } from "zod"

const outputSchema = z.number()

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const averagePrice = await db
    .selectFrom('users')
    .select(
      (eb) => eb.fn.avg<number>('price').over().as('average_price')
    )
    .executeTakeFirstOrThrow()
  
  const output = Number(averagePrice.average_price)
  
  outputSchema.parse(output)
  
  return output
})
