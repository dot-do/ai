import { createOpenAI } from '@ai-sdk/openai'
import { languageModel } from './src/registry.js'

export const model = createOpenAI({
  compatibility: 'compatible',
  apiKey: process.env.DO_TOKEN || process.env.DO_API_KEY || process.env.AI_GATEWAY_TOKEN || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_BASE_URL || 'https://api.llm.do',
  headers: {
    'HTTP-Referer': 'https://workflows.do',
    'X-Title': 'Workflows.do Business-as-Code',
  },
})

export { languageModel }
export * from './src/registry.js'

export * from '@ai-sdk/openai'
export * from '@ai-sdk/anthropic'
export * from '@ai-sdk/google'
export * from '@ai-sdk/mistral'
export * from '@ai-sdk/amazon-bedrock'
export * from '@ai-sdk/perplexity'
export * from '@ai-sdk/groq'
export * from '@ai-sdk/replicate'
