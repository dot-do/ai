/**
 * Types for mdxai - AI-powered MDX development tool
 */

export interface MdxAIConfig {
  /** OpenRouter API key */
  apiKey?: string
  /** Model to use (defaults to gpt-5) */
  model?: string
  /** Base URL for OpenRouter API */
  baseURL?: string
  /** Temperature for generation (0-1) */
  temperature?: number
  /** Maximum tokens to generate */
  maxTokens?: number
}

export interface GenerateOptions {
  /** Prompt for generation */
  prompt: string
  /** System message */
  system?: string
  /** Temperature override */
  temperature?: number
  /** Max tokens override */
  maxTokens?: number
  /** Stream the response */
  stream?: boolean
}

export interface GenerateResult {
  /** Generated content */
  content: string
  /** Model used */
  model: string
  /** Tokens used */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface BuildOptions {
  /** Path to MDX file or directory */
  path: string
  /** Output directory */
  outDir?: string
  /** Watch mode */
  watch?: boolean
}

export interface TestOptions {
  /** Path to test files */
  path: string
  /** Watch mode */
  watch?: boolean
}

export interface DeployOptions {
  /** Path to deploy */
  path: string
  /** Environment to deploy to */
  environment?: string
  /** Deployment config */
  config?: Record<string, unknown>
}

/** Frontmatter data structure */
export interface Frontmatter {
  /** Schema definition for structured content */
  schema?: Record<string, unknown>
  /** Title of the content */
  title?: string
  /** Description */
  description?: string
  /** Tags */
  tags?: string[]
  /** Any other metadata */
  [key: string]: unknown
}

/** Tool execution result */
export interface ToolResult {
  success: boolean
  error?: string
  [key: string]: unknown
}
