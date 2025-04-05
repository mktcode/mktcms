import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses.mjs';
import { PrepareContent } from '~/types';

export async function suggestSloganFromUserInfo(prepareContent: PrepareContent) {
  const { openaiApiKey } = useRuntimeConfig()

  const openai = new OpenAI({
    apiKey: openaiApiKey
  });

  const messages: ResponseInput = [
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Wer sind deine typischen Kunden?`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.aboutTargetGroup || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Dein Angebot in einem Satz`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.offerShortDescription || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Dein Angebot im Detail`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.offerDetails || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Werte und Philosophie`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.companyValues || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Kommunikationsstil`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.communicationTone || 'Keine Angabe' },
      ]
    },
  ]

  const response = await openai.responses.create({
    store: false,
    model: 'gpt-4o-mini',
    instructions: "Erstelle bitte drei kurze und prägnante Slogan-Vorschläge, die zur Beschreibung des Kundenunternehmens passen. Die Slogans sollen die Zielgruppe ansprechen und gut mit dem Firmennamen kombinierbar sein. Jeder Slogan soll für sich alleine stehen, ohne zweiteiligen Aufbau (z. B. keine Slogans mit Gedankenstrich, Doppelpunkt oder zwei klar getrennten Phrasen). Die drei Varianten sollen sich in Tonalität und Aussage deutlich unterscheiden.",
    input: messages,
    text: {
      format: {
        type: "json_schema",
        name: "slogan",
        schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              description: "Eine Liste von drei Slogans, die zu den Angaben des Kunden passen.",
              items: {
                type: "string",
              },
            },
          },
          required: [
            'suggestions',
          ],
          additionalProperties: false,
        },
      },
    },
  })

  const result = JSON.parse(response.output_text) as {
    suggestions: string[]
  }

  if (!Array.isArray(result.suggestions)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Fehler beim Erstellen der Slogans',
    })
  }

  return result.suggestions
}

export async function generateWebsiteFromUserInfo(prepareContent: PrepareContent) {
  const { openaiApiKey } = useRuntimeConfig()
  const db = await getDatabaseConnection()

  const openai = new OpenAI({
    apiKey: openaiApiKey
  });

  const messages: ResponseInput = [
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Slogan`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.slogan || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Wer sind deine typischen Kunden?`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.aboutTargetGroup || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Dein Angebot in einem Satz`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.offerShortDescription || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Dein Angebot im Detail`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.offerDetails || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Werte und Philosophie`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.companyValues || 'Keine Angabe' },
      ]
    },
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: `Kommunikationsstil`
      }]
    },
    {
      role: 'user',
      content: [
        { type: 'input_text', text: prepareContent.communicationTone || 'Keine Angabe' },
      ]
    },
  ]

  const response = await openai.responses.create({
    store: false,
    model: 'gpt-4o-mini',
    instructions: "Erstelle aus den Angaben des Kunden bitte sinnvolle Texte und Einstellungen für die Website. Der Baukasten gibt die Struktur der Website grundlegend vor. Eine genaue Analyse der Angaben ist erforderlich, um anschließend profesisonelle und sinnvolle Inhalte für den Kunden zu verfassen. Entscheide selbst, welche Sektionen, Elemente und Funktionen am sinnvollsten sind. Lass im Zweifel Felder leer anstatt dir etwas auszudenken, aber versuche auch, alle inhaltlichen Möglichekeiten auszuschöpfen. Bitte achte darauf, dass die Texte gut lesbar sind und dem Kunden gefallen könnten. Schreibt der Kunde aus Ich- oder Wir-Perspektive, dann übernehme das auch so für die Website. Wenn der Kunde keine Angaben macht, gehe davon aus, dass er eine professionelle und seriöse Webseite möchte.",
    input: messages,
    text: {
      format: {
        type: "json_schema",
        name: "website",
        schema: {
          type: "object",
          properties: {
            analysis: {
              type: "string",
              description: "Eine kurze Analyse der Angaben des Kunden. Was ist wichtig? Was ist weniger wichtig? Was ist besonders?"
            },
            title: {
              type: "string",
              description: "Titel der Webseite"
            },
            subtitle: {
              type: ["string", "null"],
              description: "Untertitel der Webseite"
            },
            description: {
              type: ["string", "null"],
              description: "Beschreibung der Webseite"
            },
            headerVariant: {
              type: "number",
              description: "Header Variante: 0 = Vollbild, 1 = Geteilt, 2 = Geteilt (Welle)"
            },
            showAbout: {
              type: "boolean",
              description: "Soll die Über uns Sektion angezeigt werden?"
            },
            aboutTitle: {
              type: ["string", "null"],
              description: "Titel der Über uns Sektion"
            },
            aboutSubtitle: {
              type: ["string", "null"],
              description: "Untertitel der Über uns Sektion"
            },
            aboutText: {
              type: ["string", "null"],
              description: "Text der Über uns Sektion"
            },
            showExtraContents: {
              type: "boolean",
              description: "Soll die Sektion für weitere Inhalte angezeigt werden?"
            },
            extraContents: {
              type: ["array", "null"],
              description: "Zusätzliche Inhalte",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Titel des zusätzlichen Inhalts",
                  },
                  subtitle: {
                    type: ["string", "null"],
                    description: "Untertitel des zusätzlichen Inhalts",
                  },
                  text: {
                    type: ["string", "null"],
                    description: "Text des zusätzlichen Inhalts",
                  },
                },
                required: [
                  'title',
                  'subtitle',
                  'text',
                ],
                additionalProperties: false,
              },
            },
            hasContactForm: {
              type: "boolean",
              description: "Hat die Webseite ein Kontaktformular?"
            },
            contactFormSubject: {
              type: ["string", "null"],
              description: "Betreff des Kontaktformulars"
            },
            contactFormTitle: {
              type: ["string", "null"],
              description: "Titel neben Kontaktformulars"
            },
            contactFormText: {
              type: ["string", "null"],
              description: "Text neben Kontaktformulars"
            },
          },
          required: [
            'analysis',
            'title',
            'subtitle',
            'description',
            'headerVariant',
            'showAbout',
            'aboutTitle',
            'aboutSubtitle',
            'aboutText',
            'showExtraContents',
            'extraContents',
            'hasContactForm',
            'contactFormSubject',
            'contactFormTitle',
            'contactFormText',
          ],
          additionalProperties: false,
        },
      },
    },
  })

  const websiteData = JSON.parse(response.output_text)

  const websiteInsertResult = await db.insertInto('websites').values({
    userId: prepareContent.userId,
    title: websiteData.title || '',
    subtitle: websiteData.subtitle || '',
    description: websiteData.description || '',
    headerVariant: websiteData.headerVariant || 0,
    showAbout: websiteData.showAbout || false,
    aboutTitle: websiteData.aboutTitle || '',
    aboutSubtitle: websiteData.aboutSubtitle || '',
    aboutText: websiteData.aboutText || '',
    showContents: websiteData.showExtraContents || false,
    hasContactForm: websiteData.hasContactForm || false,
    contactFormSubject: websiteData.contactFormSubject || 'Kontaktanfrage',
    contactFormTitle: websiteData.contactFormTitle || 'Kontakt',
    contactFormText: websiteData.contactFormText || '',
    isOnline: false,
    showMenu: false,
  }).executeTakeFirstOrThrow()

  if (!websiteInsertResult.insertId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Fehler beim Erstellen der Webseite',
    })
  }

  const newWebsiteId = Number(websiteInsertResult.insertId.toString())

  if (websiteData.showExtraContents && Array.isArray(websiteData.extraContents) && websiteData.extraContents.length > 0) {
    for (const [index, extraContent] of websiteData.extraContents.entries()) {
      await db.insertInto('websiteContents').values({
        websiteId: newWebsiteId,
        title: extraContent.title || '',
        subtitle: extraContent.subtitle || '',
        description: extraContent.text || '',
        orderIndex: index,
      }).execute()
    }
  }

  return newWebsiteId;
}
