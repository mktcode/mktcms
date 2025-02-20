export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = await getDatabaseConnection();
  const referers = await db.selectFrom('stats')
    .select(({ fn }) => [
      'referer',
      fn.count<number>('referer').as('count'),
    ])
    .groupBy('referer')
    .orderBy('count', 'desc')
    .execute()

  return referers;
});
