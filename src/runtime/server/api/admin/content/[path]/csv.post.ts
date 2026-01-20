import { z } from 'zod'
import { defineEventHandler, getValidatedRouterParams, readValidatedBody } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import { stringify } from 'csv-stringify/sync'

const paramsSchema = z.object({
  path: z.string().min(1),
})

const bodySchema = z.object({
  table: z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
})

export default defineEventHandler(async (event) => {
  const { path } = await getValidatedRouterParams(event, params => paramsSchema.parse(params))
  const { table } = await readValidatedBody(event, body => bodySchema.parse(body))

  const { mktcms: { s3Prefix } } = useRuntimeConfig()
  const fullPath = s3Prefix + ':' + path

  const content = stringify(table.rows, {
    header: true,
    columns: table.headers,
    delimiter: ';',
  })

  const storage = useStorage('content')
  await storage.setItem(fullPath, content)

  return { success: true }
})
