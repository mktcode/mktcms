import { z } from "zod";

const paramsSchema = z.object({
  hostname: z.string()
})

export default defineEventHandler(async (event) => {
  const { hostname } = await getValidatedRouterParams(event, paramsSchema.parse);

  return await loadData(hostname);
})
