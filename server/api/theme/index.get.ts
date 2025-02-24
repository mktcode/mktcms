import defaultColors from "~/defaultColors";

export default defineEventHandler(async () => {
  const db = await getDatabaseConnection()

  const theme = await db.selectFrom('theme').select(['primaryColor', 'primaryColorHover']).limit(1).executeTakeFirst()

  if (!theme) {
    return defaultColors
  }

  return theme
});