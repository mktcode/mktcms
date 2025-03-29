import { z } from "zod"

const outputSchema = z.object({
  total: z.number(),
  coveredMonths: z.number(),
  requiredAveragePrice: z.number(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const fixedCost = 35
  const costPerUser = 1

  let { userCount } = await db
    .selectFrom('users')
    .select(
      (eb) => eb.fn.count<number>('id').as('userCount')
    )
    .executeTakeFirstOrThrow()

  let { averagePrice, balanceTotal } = await db
    .selectFrom('users')
    .select([
      (eb) => eb.fn.avg<number>('price').over().as('averagePrice'),
      (eb) => eb.fn.sum<number>('balance').as('balanceTotal'),
    ])
    .groupBy('users.id')
    .executeTakeFirstOrThrow()
  
  averagePrice = Number(averagePrice)
  balanceTotal = Number(balanceTotal)
  userCount = Number(userCount)
  
  const total = fixedCost + (costPerUser * userCount)

  const output = {
    total,
    coveredMonths: balanceTotal ? Math.round((balanceTotal / total) * 100) / 100 : 0,
    requiredAveragePrice: userCount ? Math.round((total / userCount) * 100) / 100 : total,
  }
  
  outputSchema.parse(output)
  
  return output
})
