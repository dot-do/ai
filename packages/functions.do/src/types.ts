/**
 * Core function types and interfaces for .do platform
 *
 * Everything is a Function - the universal abstraction
 */

import type { z } from 'zod'

/**
 * Function Type - The Four Pillars
 */
export type FunctionType = 'code' | 'generative' | 'agentic' | 'human'

/**
 * Function Status
 */
export type FunctionStatus = 'registered' | 'active' | 'deprecated' | 'disabled'

/**
 * Execution Status
 */
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'awaiting_human'

/**
 * Schema definition (Zod or JSON Schema)
 */
export type Schema<T = any> =
  | z.ZodType<T>
  | {
      type: string
      properties?: Record<string, any>
      required?: string[]
      [key: string]: any
    }

/**
 * Function Metadata
 */
export interface FunctionMetadata {
  /** Function name (unique identifier) */
  name: string

  /** Human-readable display name */
  displayName?: string

  /** Function description */
  description?: string

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

  /** Created timestamp */
  createdAt?: Date

  /** Updated timestamp */
  updatedAt?: Date

  /** Custom metadata */
  custom?: Record<string, any>
}

/**
 * Function Context - runtime execution context
 */
export interface FunctionContext {
  /** Execution ID */
  executionId: string

  /** Function name */
  functionName: string

  /** User context */
  user?: {
    id: string
    email?: string
    permissions?: string[]
  }

  /** Request headers */
  headers?: Record<string, string>

  /** Environment variables */
  env?: Record<string, any>

  /** Trace ID for distributed tracing */
  traceId?: string

  /** Parent execution ID (for nested calls) */
  parentExecutionId?: string

  /** Custom context data */
  custom?: Record<string, any>
}

/**
 * Execution Result
 */
export interface ExecutionResult<TOutput = any> {
  /** Execution status */
  status: ExecutionStatus

  /** Function output (if completed) */
  output?: TOutput

  /** Error (if failed) */
  error?: {
    message: string
    code?: string
    stack?: string
    details?: any
  }

  /** Execution duration in milliseconds */
  duration?: number

  /** Tokens/credits consumed */
  cost?: number

  /** Logs */
  logs?: string[]

  /** Metadata */
  metadata?: Record<string, any>
}

/**
 * Base Function Definition
 */
export interface FunctionDefinition<TInput = any, TOutput = any> {
  /** Function ID (auto-generated from name) */
  id: string

  /** Function type */
  type: FunctionType

  /** Function status */
  status: FunctionStatus

  /** Input schema */
  input: Schema<TInput>

  /** Output schema */
  output: Schema<TOutput>

  /** Function metadata */
  metadata: FunctionMetadata

  /** Function handler */
  handler: (input: TInput, ctx: FunctionContext) => Promise<TOutput>
}

/**
 * Code Function - Pure computation
 */
export interface CodeFunction<TInput = any, TOutput = any> extends FunctionDefinition<TInput, TOutput> {
  type: 'code'

  /** Source code (optional, for eval-based execution) */
  code?: string

  /** Runtime environment */
  runtime?: 'node' | 'browser' | 'worker' | 'deno' | 'bun'
}

/**
 * Generative Function - AI-powered generation
 */
export interface GenerativeFunction<TInput = any, TOutput = any> extends FunctionDefinition<TInput, TOutput> {
  type: 'generative'

  /** AI model to use */
  model?: string

  /** System prompt template */
  systemPrompt?: string

  /** User prompt template */
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
 * Agentic Function - Multi-step AI reasoning with tools
 */
export interface AgenticFunction<TInput = any, TOutput = any> extends FunctionDefinition<TInput, TOutput> {
  type: 'agentic'

  /** Agent configuration */
  agent: {
    /** Agent model */
    model?: string

    /** Available tools */
    tools?: string[]

    /** Max reasoning steps */
    maxSteps?: number

    /** System instructions */
    instructions?: string
  }
}

/**
 * Human Function - Human-in-the-loop interaction
 */
export interface HumanFunction<TInput = any, TOutput = any> extends FunctionDefinition<TInput, TOutput> {
  type: 'human'

  /** UI configuration */
  ui: {
    /** UI type */
    type: 'slack' | 'discord' | 'email' | 'web' | 'custom'

    /** UI renderer (JSX for Slack BlockKit, etc.) */
    render: (input: TInput, ctx: FunctionContext) => any

    /** Response timeout */
    timeout?: number

    /** Reminder interval */
    reminderInterval?: number
  }

  /** Response parser */
  parseResponse?: (response: any) => TOutput
}

/**
 * Function Registry Entry
 */
export interface RegistryEntry<TInput = any, TOutput = any> {
  /** Function definition */
  function: FunctionDefinition<TInput, TOutput>

  /** Registration timestamp */
  registeredAt: Date

  /** Total executions */
  executions: number

  /** Success count */
  successes: number

  /** Failure count */
  failures: number

  /** Average duration (ms) */
  avgDuration: number

  /** Last executed */
  lastExecutedAt?: Date
}

/**
 * Execution Options
 */
export interface ExecuteOptions {
  /** Override timeout */
  timeout?: number

  /** Override retries */
  retries?: number

  /** Custom context */
  context?: Partial<FunctionContext>

  /** Async execution (return immediately) */
  async?: boolean

  /** Idempotency key */
  idempotencyKey?: string
}

/**
 * Conditional wrapper for when/then/else
 */
export interface Conditional<T> {
  then: <TOutput>(fn: (input: T) => TOutput | Promise<TOutput>) => ConditionalChain<T, TOutput>
  else: <TOutput>(fn: (input: T) => TOutput | Promise<TOutput>) => Promise<TOutput>
}

export interface ConditionalChain<TInput, TOutput> {
  else: (fn: (input: TInput) => TOutput | Promise<TOutput>) => Promise<TOutput>
  execute: (input: TInput) => Promise<TOutput>
}

/**
 * Higher-order function types
 */
export type Predicate<T> = (input: T) => boolean | Promise<boolean>
export type Mapper<TInput, TOutput> = (input: TInput) => TOutput | Promise<TOutput>
export type Reducer<TInput, TAcc> = (acc: TAcc, input: TInput) => TAcc | Promise<TAcc>
