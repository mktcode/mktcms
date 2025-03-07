import { z } from "zod";

const paramsSchema = z.object({
  hostname: z.string(),
  target: z.string()
})

export default defineEventHandler(async (event) => {
  const { hostname, target } = await getValidatedRouterParams(event, paramsSchema.parse);

  return await loadData(hostname, target);
})
