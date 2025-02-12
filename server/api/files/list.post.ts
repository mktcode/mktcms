import { readdir } from "fs/promises";
import { z } from "zod";

const bodySchema = z.object({
  extensions: z.array(z.string()).default([]),
}).default({
  extensions: [],
})

export default defineEventHandler(async (event) => {
  const { extensions } = await readValidatedBody(event, body => bodySchema.parse(body))

  const files = await readdir('public/files');

  return files.filter(file => {
    if (extensions.length === 0) return true;
    return extensions.some(ext => file.endsWith(ext));
  })
})
