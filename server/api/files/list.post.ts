import { readdir } from "fs/promises";

export default defineEventHandler(async () => {
  const files = await readdir('public/files');
  return files;
})
