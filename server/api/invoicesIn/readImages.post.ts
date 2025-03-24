import OpenAI from 'openai'
import { ResponseInput } from 'openai/resources/responses/responses.mjs'
import { z } from "zod"

const inputSchema = z.object({
  images: z.array(z.string())
})

const outputSchema = z.object({
  supplierId: z.number().nullable(),
  supplierName: z.string().nullable(),
  supplierStreet: z.string().nullable(),
  supplierCity: z.string().nullable(),
  supplierZip: z.string().nullable(),
  date: z.object({
    day: z.number(),
    month: z.number(),
    year: z.number(),
  }).nullable(),
  totalGross: z.number().nullable(),
  totalNet: z.number().nullable(),
  totalVat: z.number().nullable(),
})
export type Output = z.infer<typeof outputSchema>

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { openaiApiKey } = useRuntimeConfig()
  const { images } = await readValidatedBody(event, body => inputSchema.parse(body))
  const db = await getDatabaseConnection()

  const suppliers = await db
    .selectFrom('suppliers')
    .select(['id', 'name'])
    .where('userId', '=', user.id)
    .execute()

  const openai = new OpenAI({
    apiKey: openaiApiKey
  });

  const multiple = images.length > 1

  const systemMessage = {
    role: 'developer',
    content: [{
      type: 'input_text',
      text: `Folgende Lieferanten sind in deiner Datenbank gespeichert:\n\nID | Name\n${suppliers.map(supplier => `${supplier.id} | ${supplier.name}`).join('\n')}\n\nGebe als ID null an, wenn der Lieferant nicht in der Liste ist.`
    }]
  }

  const message = {
    role: 'user',
    content: [
      { type: 'input_text', text: `Identifiziere Rechnungsdaten (siehe Schema) in ${multiple ? 'den Bildern' : 'dem Bild'}.` },
      ...images.map(image => ({
        type: 'input_image',
        image_url: image,
        detail: 'high',
      }))
    ]
  }

  const response = await openai.responses.create({
    store: false,
    model: 'gpt-4o-mini',
    input: [systemMessage, message] as ResponseInput,
    text: {
      format: {
        type: "json_schema",
        name: "invoice",
        schema: {
          type: "object",
          properties: {
            supplierId: {
              type: ["number", "null"],
              description: "ID des Lieferanten",
            },
            supplierName: {
              type: ["string", "null"],
              description: "Firmenname des Lieferanten",
            },
            supplierStreet: {
              type: ["string", "null"],
              description: "Straße des Lieferanten",
            },
            supplierCity: {
              type: ["string", "null"],
              description: "Stadt des Lieferanten",
            },
            supplierZip: {
              type: ["string", "null"],
              description: "Postleitzahl des Lieferanten",
            },
            date: {
              type: ["object", "null"],
              description: "Rechnungsdatum",
              properties: {
                day: {
                  type: "number",
                  description: "Tag"
                },
                month: {
                  type: "number",
                  description: "Monat"
                },
                year: {
                  type: "number",
                  description: "Jahr"
                },
              },
              required: ["day", "month", "year"],
              additionalProperties: false,
            },
            totalGross: {
              type: ["number", "null"],
              description: "Bruttobetrag"
            },
            totalNet: {
              type: ["number", "null"],
              description: "Nettobetrag"
            },
            totalVat: {
              type: ["number", "null"],
              description: "Steuerbetrag"
            },
          },
          required: [
            'supplierId',
            'supplierName',
            'supplierStreet',
            'supplierCity',
            'supplierZip',
            'date',
            'totalGross',
            'totalNet',
            'totalVat'
          ],
          additionalProperties: false,
        },
      },
    },
  })

  const imageData = JSON.parse(response.output_text)

  outputSchema.parse(imageData)

  return imageData
})
