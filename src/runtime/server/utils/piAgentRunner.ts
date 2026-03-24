import { createError } from 'h3'
import {
  AuthStorage,
  createAgentSession,
  createCodingTools,
  DefaultResourceLoader,
  ModelRegistry,
  SessionManager,
  SettingsManager,
  createReadOnlyTools,
} from '@mariozechner/pi-coding-agent'
import { getModel } from '@mariozechner/pi-ai'

type PiPromptOptions = {
  cwd: string
  provider: string
  modelId: string
  apiKey: string
  systemPrompt: string
  prompt: string
  maxChars?: number
  tools?: 'none' | 'readOnly' | 'coding'
}

function extractLastAssistantText(messages: any[]) {
  for (let index = messages.length - 1; index >= 0; index--) {
    const message = messages[index]
    if (!message || message.role !== 'assistant') {
      continue
    }

    const content = message.content
    if (typeof content === 'string') {
      return content
    }

    if (Array.isArray(content)) {
      return content
        .filter(part => part && part.type === 'text' && typeof part.text === 'string')
        .map(part => part.text)
        .join('')
    }
  }

  return ''
}

export async function runPiPrompt(options: PiPromptOptions) {
  const {
    cwd,
    provider,
    modelId,
    apiKey,
    systemPrompt,
    prompt,
    maxChars = 20000,
    tools = 'none',
  } = options

  if (!apiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Admin chat is not configured',
    })
  }

  const authStorage = AuthStorage.create()
  authStorage.setRuntimeApiKey(provider, apiKey)

  const modelRegistry = new ModelRegistry(authStorage)
  const model = modelRegistry.find(provider, modelId) ?? getModel(provider as any, modelId)

  if (!model) {
    throw createError({
      statusCode: 503,
      statusMessage: `Model not found: ${provider}/${modelId}`,
    })
  }

  const settingsManager = SettingsManager.inMemory({
    compaction: { enabled: false },
    retry: { enabled: false },
  })

  const resourceLoader = new DefaultResourceLoader({
    cwd,
    settingsManager,
    systemPromptOverride: () => systemPrompt,
  })
  await resourceLoader.reload()

  const toolList = tools === 'coding'
    ? createCodingTools(cwd)
    : tools === 'readOnly'
      ? createReadOnlyTools(cwd)
      : []

  const { session } = await createAgentSession({
    cwd,
    authStorage,
    modelRegistry,
    model,
    thinkingLevel: 'off',
    tools: toolList,
    resourceLoader,
    sessionManager: SessionManager.inMemory(),
    settingsManager,
  })

  let collected = ''
  const unsubscribe = session.subscribe((event: any) => {
    if (event?.type === 'message_update' && event?.assistantMessageEvent?.type === 'text_delta') {
      collected += String(event.assistantMessageEvent.delta ?? '')
    }
  })

  try {
    await session.prompt(prompt)

    const text = (collected || extractLastAssistantText(session.messages as any[])).trim()
    return text.length > maxChars ? text.slice(0, maxChars) : text
  }
  finally {
    try {
      unsubscribe()
    }
    finally {
      session.dispose()
    }
  }
}
