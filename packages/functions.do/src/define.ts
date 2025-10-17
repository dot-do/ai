/**
 * Function Definition API - Developer-friendly helpers for creating functions
 */

import type { FunctionDefinition, CodeFunction, GenerativeFunction, AgenticFunction, HumanFunction, FunctionMetadata, FunctionContext, Schema } from './types'
import { registerFunction } from './registry'

/**
 * Generate function ID from name
 */
function generateId(name: string): string {
  return `fn_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
}

/**
 * Base function definition options
 */
interface BaseFunctionOptions<TInput, TOutput> {
  /** Function name (unique identifier) */
  name: string

  /** Human-readable display name */
  displayName?: string

  /** Function description */
  description?: string

  /** Input schema (Zod or JSON Schema) */
  input: Schema<TInput>

  /** Output schema (Zod or JSON Schema) */
  output: Schema<TOutput>

  /** Function version */
  version?: string

  /** Tags for categorization */
  tags?: string[]

  /** Timeout in milliseconds */
  timeout?: number

  /** Max retry attempts */
  retries?: number

  /** Retry backoff strategy */
  retryBackoff?: 'linear' | 'exponential'

  /** Required permissions */
  permissions?: string[]

  /** Estimated cost (credits/tokens) */
  cost?: number

  /** Whether function is idempotent */
  idempotent?: boolean

  /** Whether function is deterministic */
  deterministic?: boolean

  /** Author/owner */
  author?: string

  /** Custom metadata */
  custom?: Record<string, any>

  /** Auto-register function */
  register?: boolean
}

/**
 * Code Function options
 */
interface CodeFunctionOptions<TInput, TOutput> extends BaseFunctionOptions<TInput, TOutput> {
  /** Function handler */
  handler: (input: TInput, ctx: FunctionContext) => Promise<TOutput>

  /** Source code (optional, for eval-based execution) */
  code?: string

  /** Runtime environment */
  runtime?: 'node' | 'browser' | 'worker' | 'deno' | 'bun'
}

/**
 * Generative Function options
 */
interface GenerativeFunctionOptions<TInput, TOutput> extends BaseFunctionOptions<TInput, TOutput> {
  /** Function handler (wraps AI calls) */
  handler: (input: TInput, ctx: FunctionContext) => Promise<TOutput>

  /** AI model to use */
  model?: string

  /** System prompt template */
  systemPrompt?: string

  /** User prompt template (string or function) */
  userPrompt?: string | ((input: TInput) => string)

  /** Temperature (0-2) */
  temperature?: number

  /** Max tokens */
  maxTokens?: number

  /** Few-shot examples */
  examples?: Array<{
    input: TInput
    output: TOutput
  }>
}

/**
 * Agentic Function options
 */
interface AgenticFunctionOptions<TInput, TOutput> extends BaseFunctionOptions<TInput, TOutput> {
  /** Function handler (manages agent lifecycle) */
  handler: (input: TInput, ctx: FunctionContext) => Promise<TOutput>

  /** Agent model */
  model?: string

  /** Available tools (function IDs) */
  tools?: string[]

  /** Max reasoning steps */
  maxSteps?: number

  /** System instructions */
  instructions?: string
}

/**
 * Human Function options
 */
interface HumanFunctionOptions<TInput, TOutput> extends BaseFunctionOptions<TInput, TOutput> {
  /** Function handler (manages UI and response) */
  handler: (input: TInput, ctx: FunctionContext) => Promise<TOutput>

  /** UI type */
  uiType: 'slack' | 'discord' | 'email' | 'web' | 'custom'

  /** UI renderer (JSX for Slack BlockKit, etc.) */
  render: (input: TInput, ctx: FunctionContext) => any

  /** Response timeout */
  responseTimeout?: number

  /** Reminder interval */
  reminderInterval?: number

  /** Response parser */
  parseResponse?: (response: any) => TOutput
}

/**
 * Build function metadata from options
 */
function buildMetadata<TInput, TOutput>(options: BaseFunctionOptions<TInput, TOutput>): FunctionMetadata {
  return {
    name: options.name,
    displayName: options.displayName,
    description: options.description,
    version: options.version || '1.0.0',
    tags: options.tags,
    timeout: options.timeout,
    retries: options.retries,
    retryBackoff: options.retryBackoff,
    permissions: options.permissions,
    cost: options.cost,
    idempotent: options.idempotent,
    deterministic: options.deterministic,
    author: options.author,
    createdAt: new Date(),
    updatedAt: new Date(),
    custom: options.custom,
  }
}

/**
 * Define a Code Function
 *
 * @example
 * ```typescript
 * import { z } from 'zod'
 * import { defineCodeFunction } from 'functions.do'
 *
 * const addNumbers = defineCodeFunction({
 *   name: 'addNumbers',
 *   description: 'Add two numbers together',
 *   input: z.object({ a: z.number(), b: z.number() }),
 *   output: z.number(),
 *   handler: async ({ a, b }) => a + b,
 *   deterministic: true,
 *   idempotent: true,
 * })
 * ```
 */
export function defineCodeFunction<TInput = any, TOutput = any>(options: CodeFunctionOptions<TInput, TOutput>): CodeFunction<TInput, TOutput> {
  const func: CodeFunction<TInput, TOutput> = {
    id: generateId(options.name),
    type: 'code',
    status: 'active',
    input: options.input,
    output: options.output,
    metadata: buildMetadata(options),
    handler: options.handler,
    code: options.code,
    runtime: options.runtime,
  }

  // Auto-register if requested
  if (options.register !== false) {
    registerFunction(func)
  }

  return func
}

/**
 * Define a Generative Function
 *
 * @example
 * ```typescript
 * import { z } from 'zod'
 * import { defineGenerativeFunction } from 'functions.do'
 *
 * const summarizeText = defineGenerativeFunction({
 *   name: 'summarizeText',
 *   description: 'Generate a summary of text',
 *   input: z.object({ text: z.string() }),
 *   output: z.object({ summary: z.string() }),
 *   model: 'gpt-5',
 *   systemPrompt: 'You are a helpful assistant that summarizes text.',
 *   userPrompt: (input) => `Summarize this text:\n\n${input.text}`,
 *   temperature: 0.7,
 *   handler: async (input, ctx) => {
 *     // AI worker will handle this
 *     return { summary: 'Generated summary...' }
 *   },
 * })
 * ```
 */
export function defineGenerativeFunction<TInput = any, TOutput = any>(
  options: GenerativeFunctionOptions<TInput, TOutput>
): GenerativeFunction<TInput, TOutput> {
  const func: GenerativeFunction<TInput, TOutput> = {
    id: generateId(options.name),
    type: 'generative',
    status: 'active',
    input: options.input,
    output: options.output,
    metadata: buildMetadata(options),
    handler: options.handler,
    model: options.model || 'gpt-5',
    systemPrompt: options.systemPrompt,
    userPrompt: options.userPrompt,
    temperature: options.temperature,
    maxTokens: options.maxTokens,
    examples: options.examples,
  }

  // Auto-register if requested
  if (options.register !== false) {
    registerFunction(func)
  }

  return func
}

/**
 * Define an Agentic Function
 *
 * @example
 * ```typescript
 * import { z } from 'zod'
 * import { defineAgenticFunction } from 'functions.do'
 *
 * const researchTopic = defineAgenticFunction({
 *   name: 'researchTopic',
 *   description: 'Research a topic using web search and analysis',
 *   input: z.object({ topic: z.string() }),
 *   output: z.object({ findings: z.array(z.string()), conclusion: z.string() }),
 *   model: 'gpt-5',
 *   tools: ['webSearch', 'readUrl', 'summarize'],
 *   maxSteps: 10,
 *   instructions: 'Research the topic thoroughly and provide comprehensive findings.',
 *   handler: async (input, ctx) => {
 *     // Agent worker will handle this
 *     return { findings: [], conclusion: '' }
 *   },
 * })
 * ```
 */
export function defineAgenticFunction<TInput = any, TOutput = any>(options: AgenticFunctionOptions<TInput, TOutput>): AgenticFunction<TInput, TOutput> {
  const func: AgenticFunction<TInput, TOutput> = {
    id: generateId(options.name),
    type: 'agentic',
    status: 'active',
    input: options.input,
    output: options.output,
    metadata: buildMetadata(options),
    handler: options.handler,
    agent: {
      model: options.model || 'gpt-5',
      tools: options.tools,
      maxSteps: options.maxSteps || 10,
      instructions: options.instructions,
    },
  }

  // Auto-register if requested
  if (options.register !== false) {
    registerFunction(func)
  }

  return func
}

/**
 * Define a Human Function
 *
 * @example
 * ```typescript
 * import { z } from 'zod'
 * import { defineHumanFunction } from 'functions.do'
 *
 * const approveExpense = defineHumanFunction({
 *   name: 'approveExpense',
 *   description: 'Request human approval for an expense',
 *   input: z.object({ amount: z.number(), description: z.string() }),
 *   output: z.object({ approved: z.boolean(), notes: z.string().optional() }),
 *   uiType: 'slack',
 *   render: (input, ctx) => ({
 *     blocks: [
 *       {
 *         type: 'section',
 *         text: { type: 'mrkdwn', text: `*Expense Approval Request*\n\nAmount: $${input.amount}\nDescription: ${input.description}` }
 *       },
 *       {
 *         type: 'actions',
 *         elements: [
 *           { type: 'button', text: { type: 'plain_text', text: 'Approve' }, value: 'approve', style: 'primary' },
 *           { type: 'button', text: { type: 'plain_text', text: 'Reject' }, value: 'reject', style: 'danger' }
 *         ]
 *       }
 *     ]
 *   }),
 *   responseTimeout: 3600000, // 1 hour
 *   reminderInterval: 1800000, // 30 minutes
 *   handler: async (input, ctx) => {
 *     // Human worker will handle this
 *     return { approved: false }
 *   },
 * })
 * ```
 */
export function defineHumanFunction<TInput = any, TOutput = any>(options: HumanFunctionOptions<TInput, TOutput>): HumanFunction<TInput, TOutput> {
  const func: HumanFunction<TInput, TOutput> = {
    id: generateId(options.name),
    type: 'human',
    status: 'active',
    input: options.input,
    output: options.output,
    metadata: buildMetadata(options),
    handler: options.handler,
    ui: {
      type: options.uiType,
      render: options.render,
      timeout: options.responseTimeout,
      reminderInterval: options.reminderInterval,
    },
    parseResponse: options.parseResponse,
  }

  // Auto-register if requested
  if (options.register !== false) {
    registerFunction(func)
  }

  return func
}

/**
 * Generic function definition (auto-detects type)
 *
 * @example
 * ```typescript
 * import { defineFunction } from 'functions.do'
 *
 * const myFunc = defineFunction({
 *   type: 'code',
 *   name: 'myFunction',
 *   // ... other options
 * })
 * ```
 */
export function defineFunction<TInput = any, TOutput = any>(
  options:
    | (CodeFunctionOptions<TInput, TOutput> & { type: 'code' })
    | (GenerativeFunctionOptions<TInput, TOutput> & { type: 'generative' })
    | (AgenticFunctionOptions<TInput, TOutput> & { type: 'agentic' })
    | (HumanFunctionOptions<TInput, TOutput> & { type: 'human' })
): FunctionDefinition<TInput, TOutput> {
  switch (options.type) {
    case 'code':
      return defineCodeFunction(options)
    case 'generative':
      return defineGenerativeFunction(options)
    case 'agentic':
      return defineAgenticFunction(options)
    case 'human':
      return defineHumanFunction(options as HumanFunctionOptions<TInput, TOutput>)
    default:
      throw new Error(`Unknown function type: ${(options as any).type}`)
  }
}
