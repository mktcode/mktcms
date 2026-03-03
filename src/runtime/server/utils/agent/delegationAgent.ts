import type { AgentAnswer, AgentAttachment, DelegationDecision } from './types'
import { requestOpenAIJson } from './openai'

const SYSTEM_PROMPT = `Du bist ein Delegation Agent für ein Nuxt-basiertes Admin-CMS.

Ziel:
- Interpretiere den Benutzerwunsch.
- Entscheide, ob die Aufgabe an den Content-Editing-Agenten delegiert werden kann.
- Falls Informationen fehlen, stelle präzise Rückfragen mit auswählbaren Optionen.

Wichtig:
- Antworte ausschließlich als JSON.
- Stelle nur Rückfragen, die tatsächlich für eine saubere Ausführung notwendig sind.
- Fragen sollen für UI-Buttons geeignet sein (kurze, klare Optionen).
- Nutze für Rückfragen immer zusätzlich custom input (allowCustomInput=true).
- Route "content_edit" für Aufgaben wie Dateien ersetzen, Referenzen austauschen, Markdown/MDC bearbeiten.
- Route "unsupported" für alles außerhalb von Content-Dateiänderungen.

JSON-Format:
{
  "route": "content_edit" | "clarify" | "unsupported",
  "shortReply": "kurze deutsche Antwort",
  "condensedTask": "präzise Aufgabenbeschreibung für den Ausführungsagenten",
  "constraints": ["wichtige Regeln"],
  "questions": [
    {
      "id": "short_key",
      "question": "Frage",
      "options": [{ "label": "...", "value": "..." }],
      "allowCustomInput": true
    }
  ]
}
`

function summarizeAttachments(attachments: AgentAttachment[]) {
  return attachments.slice(0, 6).map((attachment) => {
    const textSnippet = attachment.textContent
      ? attachment.textContent.slice(0, 2000)
      : ''

    return {
      name: attachment.name,
      type: attachment.type,
      size: attachment.size,
      textSnippet,
      hasBinary: Boolean(attachment.base64Content),
    }
  })
}

export async function runDelegationAgent(input: {
  prompt: string
  answers: AgentAnswer[]
  attachments: AgentAttachment[]
}): Promise<DelegationDecision> {
  const payload = {
    prompt: input.prompt,
    answers: input.answers,
    attachments: summarizeAttachments(input.attachments),
    context: {
      adminRoute: '/admin/agent',
      apiRoute: '/api/admin/agent',
      contentPathFormat: 'colon-delimited storage keys, e.g. Articles:Post.md',
      supportedCapabilities: [
        'replace file content',
        'replace references across files',
        'edit markdown with MDC syntax intact',
      ],
    },
  }

  return await requestOpenAIJson<DelegationDecision>([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: JSON.stringify(payload) },
  ])
}
