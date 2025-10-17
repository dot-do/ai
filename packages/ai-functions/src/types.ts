import { z } from 'zod'

/**
 * Schema.org Thing interface (simplified)
 * Full types available from 'schema.org.ai' package
 */
export interface Thing {
  '@type'?: string
  identifier?: string
  name?: string
  description?: string
  url?: string
  [key: string]: unknown
}

/**
 * Function metadata following Schema.org SoftwareSourceCode pattern
 */
export interface FunctionMetadata extends Partial<Thing> {
  /** Unique function identifier */
  id: string
  /** Function name */
  name: string
  /** Function description */
  description?: string
  /** Function version (semantic versioning) */
  version: string
  /** Function author */
  author?: string
  /** Function tags for discovery */
  tags?: string[]
  /** Runtime environment (node, deno, bun, etc.) */
  runtime?: string
  /** Memory limit in MB */
  memory?: number
  /** Timeout in seconds */
  timeout?: number
  /** Created timestamp */
  createdAt: string
  /** Updated timestamp */
  updatedAt: string
}

/**
 * Function source code
 */
export interface FunctionSource {
  /** Function code as string */
  code: string
  /** Entry point function name */
  handler?: string
  /** Source language */
  language: 'typescript' | 'javascript' | 'python'
  /** Dependencies */
  dependencies?: Record<string, string>
}

/**
 * Complete function definition
 */
export interface FunctionDefinition {
  /** Function metadata */
  metadata: FunctionMetadata
  /** Function source code */
  source: FunctionSource
}

/**
 * Function execution context
 */
export interface FunctionContext {
  /** Function ID being executed */
  functionId: string
  /** Execution ID for this invocation */
  executionId: string
  /** Request ID for tracing */
  requestId?: string
  /** Environment variables */
  env?: Record<string, string>
  /** Execution timeout in seconds */
  timeout: number
  /** Memory limit in MB */
  memory: number
}

/**
 * Function execution input
 */
export interface FunctionInput {
  /** Input parameters */
  params: Record<string, string | number | boolean | null | Record<string, unknown> | unknown[]>
  /** Execution context */
  context?: Partial<FunctionContext>
  /** Execution options */
  options?: ExecutionOptions
}

/**
 * Function execution options
 */
export interface ExecutionOptions {
  /** Execute in sandbox */
  sandbox?: boolean
  /** Timeout override in seconds */
  timeout?: number
  /** Memory override in MB */
  memory?: number
  /** Async execution */
  async?: boolean
}

/**
 * Function execution result
 */
export interface FunctionResult<T = unknown> {
  /** Execution success status */
  success: boolean
  /** Result data */
  data?: T
  /** Error information */
  error?: {
    message: string
    code?: string
    stack?: string
  }
  /** Execution metadata */
  execution: {
    executionId: string
    functionId: string
    startedAt: string
    completedAt: string
    duration: number
    memory: number
  }
  /** Execution logs */
  logs?: string[]
}

/**
 * Function registry entry
 */
export interface FunctionRegistryEntry {
  /** Function definition */
  definition: FunctionDefinition
  /** Deployment status */
  status: 'draft' | 'deployed' | 'archived'
  /** Deployment timestamp */
  deployedAt?: string
  /** Deployment endpoint */
  endpoint?: string
}

/**
 * Function search query
 */
export interface FunctionSearchQuery {
  /** Search by name */
  name?: string
  /** Search by tags */
  tags?: string[]
  /** Search by author */
  author?: string
  /** Search by runtime */
  runtime?: string
  /** Status filter */
  status?: 'draft' | 'deployed' | 'archived'
  /** Limit results */
  limit?: number
  /** Offset for pagination */
  offset?: number
}

/**
 * Function search result
 */
export interface FunctionSearchResult {
  /** Matching functions */
  functions: FunctionRegistryEntry[]
  /** Total count */
  total: number
  /** Query limit */
  limit: number
  /** Query offset */
  offset: number
}

/**
 * Zod schemas for validation
 */
export const FunctionMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  runtime: z.string().optional(),
  memory: z.number().positive().optional(),
  timeout: z.number().positive().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const FunctionSourceSchema = z.object({
  code: z.string().min(1),
  handler: z.string().optional(),
  language: z.enum(['typescript', 'javascript', 'python']),
  dependencies: z.record(z.string()).optional(),
})

export const FunctionDefinitionSchema = z.object({
  metadata: FunctionMetadataSchema,
  source: FunctionSourceSchema,
})

export const FunctionInputSchema = z.object({
  params: z.record(z.unknown()),
  context: z
    .object({
      functionId: z.string().optional(),
      executionId: z.string().optional(),
      requestId: z.string().optional(),
      env: z.record(z.string()).optional(),
      timeout: z.number().optional(),
      memory: z.number().optional(),
    })
    .optional(),
  options: z
    .object({
      sandbox: z.boolean().optional(),
      timeout: z.number().optional(),
      memory: z.number().optional(),
      async: z.boolean().optional(),
    })
    .optional(),
})

export const ExecutionOptionsSchema = z.object({
  sandbox: z.boolean().optional(),
  timeout: z.number().positive().optional(),
  memory: z.number().positive().optional(),
  async: z.boolean().optional(),
})
