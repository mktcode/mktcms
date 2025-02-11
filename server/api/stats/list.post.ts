import { Stat } from "~/types";

export default defineEventHandler(async () => {
  const db = await getDatabaseConnection();

  const [stats] = await db.query<Stat[]>(
    `SELECT 
      route, 
      COUNT(DISTINCT userId) AS uniqueUsers, 
      SUM(CASE WHEN isMobile = 1 THEN 1 ELSE 0 END) AS mobileCount,
      SUM(CASE WHEN isMobile = 0 THEN 1 ELSE 0 END) AS desktopCount
    FROM stats
    GROUP BY route
    ORDER BY route ASC`
  );

  return stats.map((stat) => ({
    ...stat,
    mobileCount: Number(stat.mobileCount),
    desktopCount: Number(stat.desktopCount),
  }));
});
