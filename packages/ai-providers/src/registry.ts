import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { xai } from '@ai-sdk/xai'
import { groq } from '@ai-sdk/groq'
import { bedrock } from '@ai-sdk/amazon-bedrock'
import { google } from '@ai-sdk/google'
import { vertex } from '@ai-sdk/google-vertex'
import { perplexity } from '@ai-sdk/perplexity'
import { azure } from '@ai-sdk/azure'
import { fal } from '@ai-sdk/fal'
import { deepinfra } from '@ai-sdk/deepinfra'
import { mistral } from '@ai-sdk/mistral'
import { cohere } from '@ai-sdk/cohere'
import { fireworks } from '@ai-sdk/fireworks'
import { deepseek } from '@ai-sdk/deepseek'
import { cerebras } from '@ai-sdk/cerebras'
import { replicate } from '@ai-sdk/replicate'
import { luma } from '@ai-sdk/luma'
import { createProviderRegistry } from 'ai'
import { parse, getModelId } from './parser.js'

export const registry: ReturnType<typeof createProviderRegistry> = createProviderRegistry(
  {
    anthropic,
    openai,
    xai,
    groq,
    bedrock,
    google,
    googleVertex: vertex,
    perplexity,
    azure,
    fal,
    deepinfra,
    mistral,
    cohere,
    fireworks,
    deepseek,
    cerebras,
    replicate,
    luma,
  },
  { separator: '/' }
)

/**
 * Get a language model from the registry
 *
 * Supports multiple formats:
 * - `provider/model` - Standard format (e.g., "openai/gpt-5")
 * - `model` - Short name with alias resolution (e.g., "gpt-5" → "openai/gpt-5")
 * - `provider/model(capabilities)` - With capabilities (e.g., "openai/gpt-5(vision)")
 *
 * @param modelId - Model identifier to resolve
 * @returns Language model instance from the registry
 *
 * @example
 * ```ts
 * // Using full provider/model format
 * const model = languageModel('openai/gpt-5')
 *
 * // Using alias
 * const model = languageModel('gpt-5')
 *
 * // With capabilities
 * const model = languageModel('gpt-5(vision,function-calling)')
 * ```
 */
export const languageModel = (modelId: string) => {
  const parsed = parse(modelId)
  const fullModelId = getModelId(parsed)

  try {
    // Use the registry's languageModel method directly
    // @ts-expect-error - AI SDK type definitions may not match runtime behavior
    return registry.languageModel(fullModelId)
  } catch (error) {
    throw new Error(`Failed to get model ${fullModelId} from registry: ${error instanceof Error ? error.message : String(error)}`)
  }
}
