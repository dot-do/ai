/**
 * AI integration using OpenRouter
 */

import { openai } from '@ai-sdk/openai'
import { openrouter } from '@ai-sdk/openrouter'
import { generateText, streamText } from 'ai'
import type { MdxAIConfig, GenerateOptions, GenerateResult } from './types'

const DEFAULT_MODEL = 'openai/gpt-5'
const DEFAULT_TEMPERATURE = 0.7
const DEFAULT_MAX_TOKENS = 2000

export class MdxAI {
  private config: Required<MdxAIConfig>

  constructor(config: MdxAIConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.OPENROUTER_API_KEY || '',
      model: config.model || DEFAULT_MODEL,
      baseURL: config.baseURL || 'https://openrouter.ai/api/v1',
      temperature: config.temperature ?? DEFAULT_TEMPERATURE,
      maxTokens: config.maxTokens ?? DEFAULT_MAX_TOKENS,
    }

    if (!this.config.apiKey) {
      throw new Error('OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable or pass apiKey in config.')
    }
  }

  /**
   * Generate text using AI
   */
  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const { prompt, system, temperature, maxTokens, stream = false } = options

    if (stream) {
      throw new Error('Stream mode not yet implemented for generate(). Use generateStream() instead.')
    }

    const model = openrouter(this.config.model, {
      apiKey: this.config.apiKey,
    })

    const result = await generateText({
      model,
      prompt,
      system: system || 'You are a helpful AI assistant for MDX development.',
      temperature: temperature ?? this.config.temperature,
      maxTokens: maxTokens ?? this.config.maxTokens,
    })

    return {
      content: result.text,
      model: this.config.model,
      usage: result.usage
        ? {
            promptTokens: result.usage.promptTokens,
            completionTokens: result.usage.completionTokens,
            totalTokens: result.usage.totalTokens,
          }
        : undefined,
    }
  }

  /**
   * Generate text with streaming
   */
  async *generateStream(options: GenerateOptions): AsyncGenerator<string> {
    const { prompt, system, temperature, maxTokens } = options

    const model = openrouter(this.config.model, {
      apiKey: this.config.apiKey,
    })

    const result = await streamText({
      model,
      prompt,
      system: system || 'You are a helpful AI assistant for MDX development.',
      temperature: temperature ?? this.config.temperature,
      maxTokens: maxTokens ?? this.config.maxTokens,
    })

    for await (const chunk of result.textStream) {
      yield chunk
    }
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<MdxAIConfig> {
    return { ...this.config }
  }
}

/**
 * Create a new MdxAI instance
 */
export function createAI(config?: MdxAIConfig): MdxAI {
  return new MdxAI(config)
}
