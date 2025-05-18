import { createOpenAI } from '@ai-sdk/openai'
import type { LLMs } from 'apis.do'

const provider = createOpenAI({
  compatibility: 'compatible',
  apiKey: process.env.AI_GATEWAY_TOKEN!,
  baseURL: process.env.AI_GATEWAY_URL || 'https://api.llm.do',
  headers: {
    'HTTP-Referer': 'https://workflows.do', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Workflows.do Business-as-Code', // Optional. Site title for rankings on openrouter.ai.
  },
})

export type ProviderSettings = Parameters<typeof provider>[1]

export const llm = (modelName: LLMs, settings?: ProviderSettings): ReturnType<typeof provider> => provider(modelName as any, settings)
