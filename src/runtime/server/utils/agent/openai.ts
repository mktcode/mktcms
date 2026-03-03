import { useRuntimeConfig } from 'nitropack/runtime'

type OpenAIMessage = {
  role: 'system' | 'user'
  content: string
}

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
}

export async function requestOpenAIJson<T>(messages: OpenAIMessage[]): Promise<T> {
  const runtimeConfig = useRuntimeConfig() as any
  const openaiApiKey = runtimeConfig.mktcms?.openaiApiKey as string | undefined
  const openaiBaseUrl = runtimeConfig.mktcms?.openaiBaseUrl as string | undefined
  const openaiModel = runtimeConfig.mktcms?.openaiModel as string | undefined

  if (!openaiApiKey) {
    throw new Error('Missing OpenAI config: NUXT_MKTCMS_OPENAI_API_KEY')
  }

  const baseUrl = (openaiBaseUrl || 'https://api.openai.com/v1').replace(/\/$/, '')
  const model = openaiModel || 'gpt-5.3-codex'

  const response = await $fetch<OpenAIChatResponse>(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      model,
      temperature: 0.1,
      response_format: {
        type: 'json_object',
      },
      messages,
    },
  })

  const content = response.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('Empty OpenAI response')
  }

  try {
    return JSON.parse(content) as T
  }
  catch {
    throw new Error('Invalid JSON from OpenAI response')
  }
}
