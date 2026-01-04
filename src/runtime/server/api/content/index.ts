import db from "~~/db";
import { contentTable } from "~~/db/schema";

export default defineEventHandler(async (event) => {
  const content = await db.select().from(contentTable);
  return content;
});