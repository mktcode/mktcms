import z from "zod";
import db from "~~/db";
import { contentTable } from "~~/db/schema";

const bodySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string().min(1),
  date: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, body => bodySchema.parse(body));

  const result = await db.insert(contentTable).values({
    title: body.title,
    slug: body.slug,
    body: body.body,
    date: body.date || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return { id: Number(result.lastInsertRowid) };
});