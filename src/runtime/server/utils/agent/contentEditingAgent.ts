import { useStorage } from 'nitropack/runtime'
import { normalizeContentKey } from '../contentKey'
import type {
  AgentAnswer,
  AgentAttachment,
  AgentQuestion,
  ContentEditExecution,
  ContentEditOperation,
  ContentEditPlan,
} from './types'
import { requestOpenAIJson } from './openai'

const EDITABLE_EXTENSIONS = ['md', 'txt', 'json', 'csv']

const SYSTEM_PROMPT = `Du bist ein Content-Editing-Agent für mktcms.

Arbeitsauftrag:
- Erzeuge einen konkreten, sicheren Edit-Plan als JSON.
- Frage nur nach, wenn zwingend Informationen fehlen.
- Fokus: Dateien ersetzen, Referenzen ersetzen, Markdown bearbeiten.
- Bei Markdown: @nuxtjs/mdc Syntax strikt erhalten (::component, :::, :props, fenced code, frontmatter).

Sicherheits- und Qualitätsregeln:
- Nutze nur vorhandene Dateien oder klar benannte Zielpfade.
- Keine destruktiven Änderungen ohne klare Benutzerintention.
- Wenn Commit-Message fehlt, frage danach.
- Wenn Zielpfad unklar ist, frage nach.
- Keine Halluzinationen über Dateiinhalte.

JSON-Format:
{
  "shortReply": "kurze deutsche Antwort",
  "commitMessage": "string",
  "questions": [
    {
      "id": "short_key",
      "question": "Frage",
      "options": [{ "label": "...", "value": "..." }],
      "allowCustomInput": true
    }
  ],
  "operations": [
    {
      "type": "overwrite_file",
      "path": "Articles:Foo.md",
      "content": "..."
    },
    {
      "type": "replace_in_file",
      "path": "Articles:Foo.md",
      "find": "alt",
      "replace": "neu",
      "replaceAll": true
    },
    {
      "type": "replace_references",
      "find": "/old/path",
      "replace": "/new/path",
      "extensions": ["md", "txt"]
    }
  ]
}
`

function isEditableTextPath(path: string) {
  const extension = path.split('.').pop()?.toLowerCase() || ''
  return EDITABLE_EXTENSIONS.includes(extension)
}

function summarizeAttachments(attachments: AgentAttachment[]) {
  return attachments.slice(0, 6).map((attachment) => ({
    name: attachment.name,
    type: attachment.type,
    size: attachment.size,
    textContent: attachment.textContent ? attachment.textContent.slice(0, 5000) : undefined,
    hasBinary: Boolean(attachment.base64Content),
  }))
}

function sanitizeQuestions(questions: AgentQuestion[] | undefined): AgentQuestion[] {
  if (!Array.isArray(questions)) {
    return []
  }

  return questions
    .filter(question => question && question.id && question.question)
    .map(question => ({
      id: question.id,
      question: question.question,
      options: Array.isArray(question.options) ? question.options.slice(0, 6) : [],
      allowCustomInput: question.allowCustomInput !== false,
    }))
}

function sanitizeOperations(operations: ContentEditOperation[] | undefined): ContentEditOperation[] {
  if (!Array.isArray(operations)) {
    return []
  }

  return operations.slice(0, 30)
}

export async function planContentEdits(input: {
  prompt: string
  condensedTask: string
  constraints: string[]
  answers: AgentAnswer[]
  attachments: AgentAttachment[]
}): Promise<ContentEditPlan> {
  const storage = useStorage('content')
  const allKeys = await storage.getKeys('')
  const editableKeys = allKeys.filter(isEditableTextPath).slice(0, 500)

  const payload = {
    prompt: input.prompt,
    condensedTask: input.condensedTask,
    constraints: input.constraints,
    answers: input.answers,
    editableKeys,
    attachments: summarizeAttachments(input.attachments),
    guidance: {
      pathFormat: 'colon-delimited storage keys',
      markdownMdc: [
        'frontmatter should remain valid yaml between --- blocks',
        'MDC blocks and directives must stay syntactically valid',
        'do not break fenced code blocks',
      ],
    },
  }

  const plan = await requestOpenAIJson<ContentEditPlan>([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: JSON.stringify(payload) },
  ])

  return {
    shortReply: plan.shortReply || 'Änderungen vorbereitet.',
    commitMessage: plan.commitMessage || '',
    questions: sanitizeQuestions(plan.questions),
    operations: sanitizeOperations(plan.operations),
  }
}

function replaceText(source: string, find: string, replaceWith: string, replaceAll: boolean) {
  if (!find) {
    return source
  }

  if (replaceAll) {
    return source.split(find).join(replaceWith)
  }

  return source.replace(find, replaceWith)
}

export async function executeContentEdits(operations: ContentEditOperation[]): Promise<ContentEditExecution> {
  const storage = useStorage('content')
  const changedFiles = new Set<string>()
  const warnings: string[] = []

  for (const operation of operations) {
    if (operation.type === 'overwrite_file') {
      const path = normalizeContentKey(operation.path)

      if (!isEditableTextPath(path)) {
        warnings.push(`Übersprungen (nicht editierbarer Dateityp): ${path}`)
        continue
      }

      await storage.setItem(path, operation.content)
      changedFiles.add(path)
      continue
    }

    if (operation.type === 'replace_in_file') {
      const path = normalizeContentKey(operation.path)

      if (!isEditableTextPath(path)) {
        warnings.push(`Übersprungen (nicht editierbarer Dateityp): ${path}`)
        continue
      }

      const current = await storage.getItem<string>(path)
      if (typeof current !== 'string') {
        warnings.push(`Übersprungen (Datei nicht gefunden oder nicht textbasiert): ${path}`)
        continue
      }

      const next = replaceText(current, operation.find, operation.replace, Boolean(operation.replaceAll))

      if (next === current) {
        warnings.push(`Kein Treffer für Ersetzung in ${path}`)
        continue
      }

      await storage.setItem(path, next)
      changedFiles.add(path)
      continue
    }

    if (operation.type === 'replace_references') {
      const allKeys = await storage.getKeys('')
      const allowedExtensions = (operation.extensions || ['md', 'txt', 'json', 'csv'])
        .map(ext => ext.toLowerCase())
      const candidateKeys = allKeys.filter((key) => {
        const extension = key.split('.').pop()?.toLowerCase() || ''
        return allowedExtensions.includes(extension)
      })

      for (const key of candidateKeys) {
        const path = normalizeContentKey(key)
        const current = await storage.getItem<string>(path)

        if (typeof current !== 'string') {
          continue
        }

        const next = replaceText(current, operation.find, operation.replace, true)

        if (next === current) {
          continue
        }

        await storage.setItem(path, next)
        changedFiles.add(path)
      }

      continue
    }
  }

  return {
    changedFiles: Array.from(changedFiles),
    warnings,
  }
}
