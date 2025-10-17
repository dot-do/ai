import { ReactNode } from 'react'
import { z } from 'zod'

/**
 * Props for the AI component
 */
export interface AIProps {
  /**
   * AI model to use. Can be a string (e.g., 'gpt-4.1') or a model object from ai-providers
   * @default 'gpt-4o'
   */
  model: string | any

  /**
   * Schema defining the structure of the generated content
   */
  schema: Record<string, any> | z.ZodType<any>

  /**
   * Prompt to send to the AI model
   */
  prompt: string

  /**
   * Whether to stream the AI response in real-time
   * @default false
   */
  stream?: boolean

  /**
   * Output format for the generated content
   * @default 'object'
   */
  output?: 'object' | 'array'

  /**
   * Number of columns for array output (only used when output='array')
   * @default 1
   */
  cols?: number

  /**
   * Render function that receives the generated props
   */
  children?: (props: any, state: { isStreaming: boolean; error: Error | null }) => ReactNode

  /**
   * Optional API endpoint for proxy implementation
   */
  apiEndpoint?: string
}

/**
 * State for the AI component
 */
export interface AIState {
  /**
   * Generated content
   */
  result: any

  /**
   * Whether the content is currently streaming
   */
  isStreaming: boolean

  /**
   * Error that occurred during generation
   */
  error: Error | null
}

/**
 * Options for streamObject function
 */
export interface StreamObjectOptions {
  /**
   * AI model to use
   */
  model: any

  /**
   * Prompt to send to the AI model
   */
  prompt: string

  /**
   * Schema defining the structure of the generated content
   */
  schema?: z.ZodType<any>

  /**
   * Temperature for the AI model
   */
  temperature?: number

  /**
   * Maximum number of tokens to generate
   */
  maxTokens?: number

  /**
   * Output format for the generated content
   */
  output?: 'object' | 'array'

  /**
   * Additional options to pass to the AI model
   */
  [key: string]: any
}

/**
 * Result of streamObject function
 */
export interface StreamObjectResult {
  /**
   * Async iterable for the streamed content
   */
  objectStream: AsyncIterable<any>

  /**
   * Warnings that occurred during generation
   */
  warnings?: string[]

  /**
   * Usage information for the AI model
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
