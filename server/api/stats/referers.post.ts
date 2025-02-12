import { Referer } from "~/types";

export default defineEventHandler(async () => {
  const db = await getDatabaseConnection();

  const [referers] = await db.query<Referer[]>(
    `SELECT 
      referer,
      COUNT(DISTINCT userId) AS uniqueUsers, 
      SUM(CASE WHEN isMobile = 1 THEN 1 ELSE 0 END) AS mobileCount,
      SUM(CASE WHEN isMobile = 0 THEN 1 ELSE 0 END) AS desktopCount
    FROM stats
    GROUP BY referer
    ORDER BY referer ASC`
  );

  return referers.map((referer) => ({
    ...referer,
    mobileCount: Number(referer.mobileCount),
    desktopCount: Number(referer.desktopCount),
  }));
});
