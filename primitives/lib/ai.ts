import { embed, embedMany, generateObject, generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export type OpenAIModelOptions = {
  structuredOutputs?: boolean
  compatibility?: 'strict' | 'compatible'
  logitBias?: Record<string, number>
  user?: string
  downloadImages?: boolean
  reasoningEffort?: 'low' | 'medium' | 'high'
}

export type OpenAIProviderConfig = {
  compatibility: 'compatible' | 'strict'
  apiKey: string
  baseURL: string
  headers?: Record<string, string>
}

export type AIModelProvider = {
  (modelName: string, options?: OpenAIModelOptions): any
}

export const model = createOpenAI({
  compatibility: 'compatible',
  apiKey: process.env.AI_GATEWAY_TOKEN!,
  baseURL: process.env.AI_GATEWAY_URL!,
  headers: {
    'HTTP-Referer': 'https://workflows.do', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Workflows.do Business-as-Code', // Optional. Site title for rankings on openrouter.ai.
  },
}) as AIModelProvider

export type ModelData = {
  slug: string
}

export const getModels = (): Promise<string[]> => fetch('https://openrouter.ai/api/frontend/models/find')
  .then((res) => res.json())
  .then(({ data }) => data.models.map((model: ModelData) => model.slug))
