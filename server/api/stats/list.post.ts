import { Stat } from "~/types";

export default defineEventHandler(async () => {
  const db = await getDatabaseConnection();

  // CREATE TABLE IF NOT EXISTS stats (
  //   id INTEGER PRIMARY KEY AUTOINCREMENT,
  //   userId TEXT NOT NULL,
  //   route TEXT NOT NULL,
  //   referer TEXT,
  //   isMobile INTEGER NOT NULL,
  //   timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  // );

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
