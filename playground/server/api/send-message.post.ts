import z from 'zod'
import { defineEventHandler, readValidatedBody } from 'h3'

const bodySchema = z.object({
  subject: z.string(),
  fields: z.record(z.string(), z.any()),
})

export default defineEventHandler(async (event) => {
  const { subject, fields } = await readValidatedBody(event, body => bodySchema.parse(body))

  await sendMail({
    subject,
    fields,
  })

  return { success: true }
})
