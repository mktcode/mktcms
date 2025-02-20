import { Stat } from "~/types";

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = await getDatabaseConnection();

  const stats = await db
    .selectFrom('stats')
    .select(({ fn }) => [
      'route',
      fn.count<number>('userId').as('count'),
      fn.sum<number>('isMobile').as('mobileCount'),
    ])
    .groupBy('route')
    .orderBy('count', 'desc')
    .execute()

  return stats.map(stat => ({
    ...stat,
    desktopCount: stat.count - stat.mobileCount,
  }))
});
