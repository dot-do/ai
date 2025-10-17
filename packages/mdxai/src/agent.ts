/**
 * AI Agent with tool support
 */

import { openrouter } from '@ai-sdk/openrouter'
import { generateText, generateObject } from 'ai'
import { z } from 'zod'
import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import type { MdxAIConfig } from './types'
import { tools } from './tools'

const DEFAULT_MODEL = 'openai/gpt-5'
const DEFAULT_TEMPERATURE = 0.7
const DEFAULT_MAX_TOKENS = 4000

export interface AgentOptions {
  /** User prompt/request */
  prompt: string
  /** System message */
  system?: string
  /** Temperature override */
  temperature?: number
  /** Max tokens override */
  maxTokens?: number
  /** Maximum tool calls/steps */
  maxSteps?: number
}

export interface AgentStep {
  type: 'tool-call' | 'text'
  toolName?: string
  toolArgs?: Record<string, unknown>
  toolResult?: Record<string, unknown>
  text?: string
}

export interface AgentResult {
  /** Final response text */
  text: string
  /** Steps taken */
  steps: AgentStep[]
  /** Usage information */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export class MdxAgent {
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
   * Run the agent with tool support
   */
  async run(options: AgentOptions): Promise<AgentResult> {
    const { prompt, system, temperature, maxTokens, maxSteps = 10 } = options

    const model = openrouter(this.config.model, {
      apiKey: this.config.apiKey,
    })

    const result = await generateText({
      model,
      prompt,
      system:
        system ||
        `You are an AI agent for MDX development. You have access to tools for working with MDX files, managing tasks, and generating content.

Available tools:
- mdxe_compile: Compile MDX to JavaScript
- mdxe_render: Render MDX to HTML
- mdxe_validate: Validate MDX syntax
- mdxdb_read: Read markdown/MDX files with frontmatter
- mdxdb_write: Write markdown/MDX files with frontmatter
- list: List files in a directory
- todo: Manage todo items (add, list, complete, remove)
- forEach: Iterate over items
- generate: Generate content (call this for sub-generation tasks)

Use these tools to accomplish the user's request. Think step by step.`,
      tools,
      maxSteps,
      temperature: temperature ?? this.config.temperature,
      maxTokens: maxTokens ?? this.config.maxTokens,
    })

    // Extract steps information
    const steps = result.steps.map((step) => {
      if (step.type === 'tool-call') {
        return {
          type: 'tool-call' as const,
          toolName: step.toolName,
          toolArgs: step.args,
          toolResult: step.result,
        }
      } else {
        return {
          type: 'text' as const,
          text: step.text,
        }
      }
    })

    return {
      text: result.text,
      steps,
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
   * Generate text (simple mode without tools)
   */
  async generateText(options: { prompt: string; system?: string; temperature?: number; maxTokens?: number }): Promise<string> {
    const { prompt, system, temperature, maxTokens } = options

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

    return result.text
  }

  /**
   * Generate object with schema
   */
  async generateObject<T>(options: { prompt: string; schema: z.ZodSchema<T>; system?: string; temperature?: number; maxTokens?: number }): Promise<T> {
    const { prompt, schema, system, temperature, maxTokens } = options

    const model = openrouter(this.config.model, {
      apiKey: this.config.apiKey,
    })

    const result = await generateObject({
      model,
      prompt,
      schema,
      system: system || 'You are a helpful AI assistant for MDX development.',
      temperature: temperature ?? this.config.temperature,
      maxTokens: maxTokens ?? this.config.maxTokens,
    })

    return result.object
  }

  /**
   * Smart generate - detects schema from file frontmatter or generates markdown
   */
  async generate(options: { prompt: string; schemaPath?: string; system?: string }): Promise<string | object> {
    const { prompt, schemaPath, system } = options

    // If schema path provided, try to extract schema from frontmatter
    if (schemaPath) {
      try {
        const content = await readFile(schemaPath, 'utf-8')
        const { data: frontmatter } = matter(content)

        // Check if frontmatter has a schema definition
        if (frontmatter.schema) {
          // Try to parse the schema - this is simplified
          // In practice, you'd need proper schema parsing from the frontmatter
          console.log('Schema detected in frontmatter, using generateObject')

          // For now, use json_object mode as a fallback
          const model = openrouter(this.config.model, {
            apiKey: this.config.apiKey,
          })

          const result = await generateObject({
            model,
            prompt,
            schema: z.object({}).passthrough(), // Accept any object structure
            system: system || 'You are a helpful AI assistant for MDX development.',
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
          })

          return result.object
        }
      } catch (error) {
        console.warn('Could not read schema from file, falling back to text generation:', error)
      }
    }

    // Default to text generation
    return await this.generateText({ prompt, system })
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<MdxAIConfig> {
    return { ...this.config }
  }
}

/**
 * Create a new MdxAgent instance
 */
export function createAgent(config?: MdxAIConfig): MdxAgent {
  return new MdxAgent(config)
}
