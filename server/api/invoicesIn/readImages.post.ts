import OpenAI from 'openai'
import { ResponseInput } from 'openai/resources/responses/responses.mjs'
import { z } from "zod"

const bodySchema = z.object({
  images: z.array(z.string())
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { openaiApiKey } = useRuntimeConfig()
  const { images } = await readValidatedBody(event, body => bodySchema.parse(body))
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
      text: `Folgende Lieferanten sind in deiner Datenbank gespeichert:\n\nID | Name\n${suppliers.map(supplier => `${supplier.id} | ${supplier.name}`).join('\n')}`
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
    model: 'gpt-4o',
    input: [systemMessage, message] as ResponseInput,
    text: {
      format: {
        type: "json_schema",
        name: "invoice",
        schema: {
          type: "object",
          properties: {
            supplierId: {
              type: "number",
              description: "ID des Lieferanten (Falls bekannt. Name auf der Rechnung kann leicht vom Namen in der Datenbank abweichen. 0 wenn unbekannt)",
            },
            date: {
              type: "object",
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
            totalNet: {
              type: "number",
              description: "Nettobetrag"
            },
            totalGross: {
              type: "number",
              description: "Bruttobetrag"
            },
            tax: {
              type: "number",
              description: "Steuerbetrag"
            },
          },
          required: ["supplierId", "date", "totalNet", "totalGross", "tax"],
          additionalProperties: false,
        },
      },
    },
  })

  return JSON.parse(response.output_text)
})
