/**
 * Actions System for .do SDK
 *
 * Provides reusable actions for workflows and automation.
 * Actions are composable units of work that can be chained together.
 *
 * Features:
 * - Action definition with type-safe parameters
 * - Built-in action library (email, database, API, transforms)
 * - Action composition (pipe, parallel, sequential)
 * - Retry strategies with backoff
 * - Error handling and recovery
 * - Action registration and discovery
 *
 * Usage:
 *
 * ```typescript
 * import { defineAction, actions, $ } from 'sdk.do'
 *
 * // Define custom action
 * const sendWelcomeEmail = defineAction({
 *   name: 'send-welcome-email',
 *   description: 'Send welcome email to new user',
 *   parameters: {
 *     userId: { type: 'string', required: true },
 *     template: { type: 'string', default: 'welcome' }
 *   },
 *   handler: async ({ userId, template }) => {
 *     const user = await $.database.get('users', userId)
 *     await $.events.publish('email.send', { to: user.email, template })
 *     return { sent: true, userId }
 *   },
 *   retry: {
 *     maxAttempts: 3,
 *     backoff: 'exponential'
 *   }
 * })
 *
 * // Use action
 * const result = await sendWelcomeEmail.execute({ userId: '123' })
 *
 * // Compose actions
 * const pipeline = actions.compose([
 *   actions.database.get('users', 'user-123'),
 *   actions.transform.map(user => ({ ...user, verified: true })),
 *   actions.database.update('users', 'user-123')
 * ])
 * await pipeline.execute()
 * ```
 */

import type { BusinessContext } from './types'
import type { RetryConfig, BackoffStrategy } from './workflows'

/**
 * Parameter type definition
 */
export type ParameterType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any'

/**
 * Parameter definition with validation
 */
export interface ParameterDefinition {
  /** Parameter type */
  type: ParameterType
  /** Is this parameter required? */
  required?: boolean
  /** Default value if not provided */
  default?: any
  /** Human-readable description */
  description?: string
  /** Validation function */
  validate?: (value: any) => boolean
  /** Example value */
  example?: any
}

/**
 * Action definition configuration
 */
export interface ActionDefinition<TParams = any, TResult = any> {
  /** Unique action name (kebab-case) */
  name: string
  /** Human-readable description */
  description: string
  /** Parameter definitions */
  parameters?: Record<string, ParameterDefinition>
  /** Action handler function */
  handler: (params: TParams, context?: ActionContext) => Promise<TResult> | TResult
  /** Retry configuration */
  retry?: RetryConfig
  /** Timeout in milliseconds */
  timeout?: number
  /** Tags for categorization */
  tags?: string[]
  /** Metadata */
  metadata?: Record<string, any>
}

/**
 * Action execution context
 */
export interface ActionContext {
  /** Action name */
  actionName: string
  /** Execution ID */
  executionId: string
  /** Parent action (for composed actions) */
  parentAction?: string
  /** Attempt number (for retries) */
  attempt: number
  /** Start time */
  startTime: Date
  /** Business context (SDK services) */
  $?: BusinessContext
  /** Custom context data */
  metadata?: Record<string, any>
}

/**
 * Action execution result
 */
export interface ActionResult<TResult = any> {
  /** Execution ID */
  id: string
  /** Action name */
  action: string
  /** Execution status */
  status: 'success' | 'error' | 'timeout'
  /** Result data (if successful) */
  result?: TResult
  /** Error (if failed) */
  error?: {
    message: string
    code?: string
    stack?: string
  }
  /** Metadata */
  metadata: {
    /** Start time (ISO 8601) */
    startTime: string
    /** End time (ISO 8601) */
    endTime: string
    /** Duration in milliseconds */
    duration: number
    /** Number of attempts */
    attempts: number
  }
}

/**
 * Action instance with execute method
 */
export interface Action<TParams = any, TResult = any> {
  /** Action definition */
  definition: ActionDefinition<TParams, TResult>
  /** Execute the action */
  execute(params: TParams, context?: Partial<ActionContext>): Promise<ActionResult<TResult>>
  /** Get action metadata */
  getMetadata(): {
    name: string
    description: string
    parameters: Record<string, ParameterDefinition>
    tags: string[]
  }
}

/**
 * Composed action (pipeline)
 */
export interface ComposedAction<TInput = any, TOutput = any> {
  /** Execute the composed action */
  execute(input: TInput, context?: Partial<ActionContext>): Promise<ActionResult<TOutput>>
}

/**
 * Action execution options
 */
export interface ExecuteOptions {
  /** Custom context data */
  context?: Record<string, any>
  /** Override retry configuration */
  retry?: RetryConfig
  /** Override timeout */
  timeout?: number
  /** Business context (SDK services) */
  $?: BusinessContext
}

/**
 * Validate parameter value against definition
 */
function validateParameter(value: any, definition: ParameterDefinition, paramName: string): void {
  // Check required
  if (definition.required && (value === undefined || value === null)) {
    throw new Error(`Parameter "${paramName}" is required`)
  }

  // Skip validation if value is undefined/null and not required
  if (value === undefined || value === null) {
    return
  }

  // Type validation
  const actualType = Array.isArray(value) ? 'array' : typeof value
  if (definition.type !== 'any' && actualType !== definition.type) {
    throw new Error(`Parameter "${paramName}" must be of type ${definition.type}, got ${actualType}`)
  }

  // Custom validation
  if (definition.validate && !definition.validate(value)) {
    throw new Error(`Parameter "${paramName}" failed custom validation`)
  }
}

/**
 * Validate all parameters
 */
function validateParameters(params: any, definitions?: Record<string, ParameterDefinition>): any {
  if (!definitions) return params

  const validated: any = {}

  // Validate and apply defaults
  for (const [name, definition] of Object.entries(definitions)) {
    const value = params?.[name] ?? definition.default
    validateParameter(value, definition, name)
    validated[name] = value
  }

  return validated
}

/**
 * Calculate retry delay with backoff strategy
 */
function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  const baseDelay = typeof config.delay === 'string' ? parseDuration(config.delay) : config.delay || 1000

  let delay: number
  switch (config.backoff || 'exponential') {
    case 'linear':
      delay = baseDelay * attempt
      break
    case 'exponential':
      delay = baseDelay * Math.pow(2, attempt - 1)
      break
    case 'fixed':
      delay = baseDelay
      break
    default:
      delay = baseDelay
  }

  // Apply max delay cap
  const maxDelay = config.maxDelay || 60000
  return Math.min(delay, maxDelay)
}

/**
 * Parse duration string to milliseconds
 */
function parseDuration(duration: string | number): number {
  if (typeof duration === 'number') return duration

  const match = duration.match(/^(\d+)(ms|s|m|h|d)?$/)
  if (!match) throw new Error(`Invalid duration: ${duration}`)

  const value = parseInt(match[1])
  const unit = match[2] || 'ms'

  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  }

  return value * (multipliers[unit] || 1)
}

/**
 * Execute action with retry logic
 */
async function executeWithRetry<TResult>(handler: () => Promise<TResult>, retry?: RetryConfig, context?: ActionContext): Promise<TResult> {
  const maxAttempts = retry?.max || 1
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Update context attempt number
      if (context) {
        context.attempt = attempt
      }

      return await handler()
    } catch (error) {
      lastError = error as Error

      // Don't retry if this was the last attempt
      if (attempt === maxAttempts) {
        break
      }

      // Calculate and apply delay
      const delay = calculateRetryDelay(attempt, retry!)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Define a custom action
 *
 * @example
 * ```typescript
 * const sendEmail = defineAction({
 *   name: 'send-email',
 *   description: 'Send an email',
 *   parameters: {
 *     to: { type: 'string', required: true },
 *     subject: { type: 'string', required: true },
 *     body: { type: 'string', required: true }
 *   },
 *   handler: async ({ to, subject, body }) => {
 *     // Send email logic
 *     return { sent: true }
 *   },
 *   retry: {
 *     maxAttempts: 3,
 *     backoff: 'exponential'
 *   }
 * })
 * ```
 */
export function defineAction<TParams = any, TResult = any>(definition: ActionDefinition<TParams, TResult>): Action<TParams, TResult> {
  // Validate action name
  if (!definition.name || !/^[a-z0-9-]+$/.test(definition.name)) {
    throw new Error('Action name must be kebab-case (lowercase letters, numbers, and hyphens only)')
  }

  return {
    definition,

    async execute(params: TParams, contextOverrides?: Partial<ActionContext>): Promise<ActionResult<TResult>> {
      const executionId = crypto.randomUUID()
      const startTime = new Date()

      const context: ActionContext = {
        actionName: definition.name,
        executionId,
        attempt: 1,
        startTime,
        ...contextOverrides,
      }

      try {
        // Validate parameters
        const validatedParams = validateParameters(params, definition.parameters)

        // Execute with timeout
        const timeoutMs = definition.timeout || 30000
        const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Action timeout')), timeoutMs))

        // Execute with retry
        const resultPromise = executeWithRetry(async () => definition.handler(validatedParams, context), definition.retry, context)

        const result = await Promise.race([resultPromise, timeoutPromise])

        const endTime = new Date()

        return {
          id: executionId,
          action: definition.name,
          status: 'success',
          result,
          metadata: {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: endTime.getTime() - startTime.getTime(),
            attempts: context.attempt,
          },
        }
      } catch (error) {
        const endTime = new Date()
        const err = error as Error

        return {
          id: executionId,
          action: definition.name,
          status: err.message === 'Action timeout' ? 'timeout' : 'error',
          error: {
            message: err.message,
            code: (err as any).code,
            stack: err.stack,
          },
          metadata: {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: endTime.getTime() - startTime.getTime(),
            attempts: context.attempt,
          },
        }
      }
    },

    getMetadata() {
      return {
        name: definition.name,
        description: definition.description,
        parameters: definition.parameters || {},
        tags: definition.tags || [],
      }
    },
  }
}

/**
 * Actions service for managing and executing actions
 */
export class ActionsService {
  private registry = new Map<string, Action>()
  private client?: BusinessContext

  constructor(client?: BusinessContext) {
    this.client = client
    this.registerBuiltInActions()
  }

  /**
   * Register a custom action
   */
  register<TParams = any, TResult = any>(action: Action<TParams, TResult>): void {
    this.registry.set(action.definition.name, action)
  }

  /**
   * Get a registered action by name
   */
  get<TParams = any, TResult = any>(name: string): Action<TParams, TResult> | undefined {
    return this.registry.get(name) as Action<TParams, TResult> | undefined
  }

  /**
   * List all registered actions
   */
  list(): Action[] {
    return Array.from(this.registry.values())
  }

  /**
   * Search actions by tag
   */
  findByTag(tag: string): Action[] {
    return this.list().filter((action) => action.definition.tags?.includes(tag))
  }

  /**
   * Execute an action by name
   */
  async execute<TParams = any, TResult = any>(name: string, params: TParams, options?: ExecuteOptions): Promise<ActionResult<TResult>> {
    const action = this.get<TParams, TResult>(name)
    if (!action) {
      throw new Error(`Action not found: ${name}`)
    }

    return action.execute(params, {
      $: options?.$ || this.client,
      metadata: options?.context,
    })
  }

  /**
   * Compose actions into a pipeline (sequential execution)
   */
  compose(actions: Action[]): ComposedAction {
    return {
      async execute(input: any, context?: Partial<ActionContext>): Promise<ActionResult> {
        let currentValue = input
        const results: ActionResult[] = []
        const startTime = new Date()

        for (const action of actions) {
          const result = await action.execute(currentValue, {
            ...context,
            parentAction: 'composed-pipeline',
          })

          results.push(result)

          if (result.status !== 'success') {
            // Pipeline failed, return error
            return {
              id: crypto.randomUUID(),
              action: 'composed-pipeline',
              status: 'error',
              error: result.error,
              metadata: {
                startTime: startTime.toISOString(),
                endTime: new Date().toISOString(),
                duration: new Date().getTime() - startTime.getTime(),
                attempts: 1,
              },
            }
          }

          currentValue = result.result
        }

        const endTime = new Date()

        return {
          id: crypto.randomUUID(),
          action: 'composed-pipeline',
          status: 'success',
          result: currentValue,
          metadata: {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: endTime.getTime() - startTime.getTime(),
            attempts: 1,
          },
        }
      },
    }
  }

  /**
   * Execute actions in parallel
   */
  parallel(actions: Array<{ action: Action; params: any }>): ComposedAction {
    return {
      async execute(_input: any, context?: Partial<ActionContext>): Promise<ActionResult> {
        const startTime = new Date()

        try {
          const results = await Promise.all(
            actions.map(({ action, params }) =>
              action.execute(params, {
                ...context,
                parentAction: 'parallel-execution',
              })
            )
          )

          // Check if any action failed
          const failed = results.find((r) => r.status !== 'success')
          if (failed) {
            return {
              id: crypto.randomUUID(),
              action: 'parallel-execution',
              status: 'error',
              error: failed.error,
              metadata: {
                startTime: startTime.toISOString(),
                endTime: new Date().toISOString(),
                duration: new Date().getTime() - startTime.getTime(),
                attempts: 1,
              },
            }
          }

          const endTime = new Date()

          return {
            id: crypto.randomUUID(),
            action: 'parallel-execution',
            status: 'success',
            result: results.map((r) => r.result),
            metadata: {
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              duration: endTime.getTime() - startTime.getTime(),
              attempts: 1,
            },
          }
        } catch (error) {
          const err = error as Error
          const endTime = new Date()

          return {
            id: crypto.randomUUID(),
            action: 'parallel-execution',
            status: 'error',
            error: {
              message: err.message,
              stack: err.stack,
            },
            metadata: {
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              duration: endTime.getTime() - startTime.getTime(),
              attempts: 1,
            },
          }
        }
      },
    }
  }

  /**
   * Conditional action execution
   */
  if<TResult = any>(condition: () => boolean | Promise<boolean>, trueAction: Action, falseAction?: Action): ComposedAction<any, TResult> {
    return {
      async execute(input: any, context?: Partial<ActionContext>): Promise<ActionResult<TResult>> {
        const shouldExecute = await condition()
        const action = shouldExecute ? trueAction : falseAction

        if (!action) {
          // No action to execute, return input
          const now = new Date()
          return {
            id: crypto.randomUUID(),
            action: 'conditional',
            status: 'success',
            result: input,
            metadata: {
              startTime: now.toISOString(),
              endTime: now.toISOString(),
              duration: 0,
              attempts: 1,
            },
          }
        }

        return action.execute(input, {
          ...context,
          parentAction: 'conditional',
        })
      },
    }
  }

  /**
   * Switch-case action execution
   */
  switch<TResult = any>(
    selector: (input: any) => string | Promise<string>,
    cases: Record<string, Action>,
    defaultAction?: Action
  ): ComposedAction<any, TResult> {
    return {
      async execute(input: any, context?: Partial<ActionContext>): Promise<ActionResult<TResult>> {
        const caseValue = await selector(input)
        const action = cases[caseValue] || defaultAction

        if (!action) {
          throw new Error(`No action defined for case: ${caseValue}`)
        }

        return action.execute(input, {
          ...context,
          parentAction: 'switch',
        })
      },
    }
  }

  /**
   * Register built-in actions
   */
  private registerBuiltInActions(): void {
    // Email actions
    this.register(
      defineAction({
        name: 'email-send',
        description: 'Send an email',
        parameters: {
          to: { type: 'string', required: true },
          subject: { type: 'string', required: true },
          body: { type: 'string', required: true },
          from: { type: 'string' },
        },
        tags: ['email', 'communication'],
        handler: async (params, context) => {
          if (!context?.$) throw new Error('Business context required')
          await context.$.events.publish('email.send', params)
          return { sent: true, to: params.to }
        },
      })
    )

    // Database actions
    this.register(
      defineAction({
        name: 'database-get',
        description: 'Get a record from the database',
        parameters: {
          collection: { type: 'string', required: true },
          id: { type: 'string', required: true },
        },
        tags: ['database', 'read'],
        handler: async (params, context) => {
          if (!context?.$) throw new Error('Business context required')
          return context.$.db.get(params.collection, params.id)
        },
      })
    )

    this.register(
      defineAction({
        name: 'database-upsert',
        description: 'Create or update a database record',
        parameters: {
          collection: { type: 'string', required: true },
          id: { type: 'string', required: true },
          data: { type: 'object', required: true },
        },
        tags: ['database', 'write'],
        handler: async (params, context) => {
          if (!context?.$) throw new Error('Business context required')
          return context.$.db.upsert(params.collection, params.id, params.data)
        },
      })
    )

    this.register(
      defineAction({
        name: 'database-delete',
        description: 'Delete a database record',
        parameters: {
          collection: { type: 'string', required: true },
          id: { type: 'string', required: true },
        },
        tags: ['database', 'delete'],
        handler: async (params, context) => {
          if (!context?.$) throw new Error('Business context required')
          return context.$.db.delete(params.collection, params.id)
        },
      })
    )

    // HTTP actions
    this.register(
      defineAction({
        name: 'http-get',
        description: 'Make an HTTP GET request',
        parameters: {
          url: { type: 'string', required: true },
          headers: { type: 'object' },
        },
        tags: ['http', 'api'],
        handler: async (params) => {
          const response = await fetch(params.url, {
            method: 'GET',
            headers: params.headers,
          })
          return response.json()
        },
      })
    )

    this.register(
      defineAction({
        name: 'http-post',
        description: 'Make an HTTP POST request',
        parameters: {
          url: { type: 'string', required: true },
          body: { type: 'object', required: true },
          headers: { type: 'object' },
        },
        tags: ['http', 'api'],
        handler: async (params) => {
          const response = await fetch(params.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...params.headers,
            },
            body: JSON.stringify(params.body),
          })
          return response.json()
        },
      })
    )

    // Transform actions
    this.register(
      defineAction({
        name: 'transform-map',
        description: 'Transform data with a mapping function',
        parameters: {
          data: { type: 'any', required: true },
          transform: { type: 'any', required: true }, // Function stored as string
        },
        tags: ['transform', 'map'],
        handler: async (params) => {
          const fn = typeof params.transform === 'function' ? params.transform : eval(`(${params.transform})`)
          if (Array.isArray(params.data)) {
            return params.data.map(fn)
          }
          return fn(params.data)
        },
      })
    )

    this.register(
      defineAction({
        name: 'transform-filter',
        description: 'Filter data with a predicate function',
        parameters: {
          data: { type: 'array', required: true },
          predicate: { type: 'any', required: true }, // Function stored as string
        },
        tags: ['transform', 'filter'],
        handler: async (params) => {
          const fn = typeof params.predicate === 'function' ? params.predicate : eval(`(${params.predicate})`)
          return params.data.filter(fn)
        },
      })
    )

    this.register(
      defineAction({
        name: 'transform-reduce',
        description: 'Reduce data with a reducer function',
        parameters: {
          data: { type: 'array', required: true },
          reducer: { type: 'any', required: true }, // Function stored as string
          initial: { type: 'any' },
        },
        tags: ['transform', 'reduce'],
        handler: async (params) => {
          const fn = typeof params.reducer === 'function' ? params.reducer : eval(`(${params.reducer})`)
          return params.data.reduce(fn, params.initial)
        },
      })
    )

    // Delay actions
    this.register(
      defineAction({
        name: 'delay-wait',
        description: 'Wait for a specified duration',
        parameters: {
          duration: { type: 'any', required: true }, // number or string like "5s"
        },
        tags: ['delay', 'wait'],
        handler: async (params) => {
          const ms = parseDuration(params.duration)
          await new Promise((resolve) => setTimeout(resolve, ms))
          return { waited: ms }
        },
      })
    )

    // Event actions
    this.register(
      defineAction({
        name: 'event-publish',
        description: 'Publish an event',
        parameters: {
          eventType: { type: 'string', required: true },
          payload: { type: 'object', required: true },
        },
        tags: ['event', 'publish'],
        handler: async (params, context) => {
          if (!context?.$) throw new Error('Business context required')
          await context.$.events.publish(params.eventType, params.payload)
          return { published: true, eventType: params.eventType }
        },
      })
    )
  }

  /**
   * Built-in actions organized by category
   */
  get email() {
    return {
      send: (params: { to: string; subject: string; body: string; from?: string }) => this.execute('email-send', params),
    }
  }

  get database() {
    return {
      get: (collection: string, id: string) => this.execute('database-get', { collection, id }),
      upsert: (collection: string, id: string, data: any) => this.execute('database-upsert', { collection, id, data }),
      delete: (collection: string, id: string) => this.execute('database-delete', { collection, id }),
    }
  }

  get http() {
    return {
      get: (url: string, headers?: Record<string, string>) => this.execute('http-get', { url, headers }),
      post: (url: string, body: any, headers?: Record<string, string>) => this.execute('http-post', { url, body, headers }),
    }
  }

  get transform() {
    return {
      map: (data: any, transform: Function) => this.execute('transform-map', { data, transform }),
      filter: (data: any[], predicate: Function) => this.execute('transform-filter', { data, predicate }),
      reduce: (data: any[], reducer: Function, initial?: any) => this.execute('transform-reduce', { data, reducer, initial }),
    }
  }

  get delay() {
    return {
      wait: (duration: number | string) => this.execute('delay-wait', { duration }),
    }
  }

  get events() {
    return {
      publish: (eventType: string, payload: any) => this.execute('event-publish', { eventType, payload }),
    }
  }
}

/**
 * Create an actions service instance
 */
export function createActionsService(client?: BusinessContext): ActionsService {
  return new ActionsService(client)
}

/**
 * Standalone action helpers for composition
 */
export const actions = {
  /**
   * Compose actions into a sequential pipeline
   */
  compose: (actions: Action[]): ComposedAction => new ActionsService().compose(actions),

  /**
   * Execute actions in parallel
   */
  parallel: (actions: Array<{ action: Action; params: any }>): ComposedAction => new ActionsService().parallel(actions),

  /**
   * Conditional action execution
   */
  if: <TResult = any>(condition: () => boolean | Promise<boolean>, trueAction: Action, falseAction?: Action): ComposedAction<any, TResult> =>
    new ActionsService().if(condition, trueAction, falseAction),

  /**
   * Switch-case action execution
   */
  switch: <TResult = any>(
    selector: (input: any) => string | Promise<string>,
    cases: Record<string, Action>,
    defaultAction?: Action
  ): ComposedAction<any, TResult> => new ActionsService().switch(selector, cases, defaultAction),

  /**
   * Built-in email actions
   */
  email: {
    send: defineAction({
      name: 'email-send-standalone',
      description: 'Send an email',
      parameters: {
        to: { type: 'string', required: true },
        subject: { type: 'string', required: true },
        body: { type: 'string', required: true },
      },
      handler: async (params, context) => {
        if (!context?.$) throw new Error('Business context required')
        await context.$.events.publish('email.send', params)
        return { sent: true }
      },
    }),
  },

  /**
   * Built-in database actions
   */
  database: {
    get: (collection: string, id: string) =>
      defineAction({
        name: `database-get-${collection}-${id}`,
        description: `Get ${id} from ${collection}`,
        handler: async (_params, context) => {
          if (!context?.$) throw new Error('Business context required')
          return context.$.db.get(collection, id)
        },
      }),
    upsert: (collection: string, id: string, data?: any) =>
      defineAction({
        name: `database-upsert-${collection}-${id}`,
        description: `Upsert ${id} in ${collection}`,
        handler: async (params, context) => {
          if (!context?.$) throw new Error('Business context required')
          return context.$.db.upsert(collection, id, data || params)
        },
      }),
    update: (collection: string, id: string) =>
      defineAction({
        name: `database-update-${collection}-${id}`,
        description: `Update ${id} in ${collection}`,
        handler: async (params, context) => {
          if (!context?.$) throw new Error('Business context required')
          return context.$.db.upsert(collection, id, params)
        },
      }),
  },

  /**
   * Built-in HTTP actions
   */
  http: {
    get: (url: string) => {
      // Normalize URL for action name (remove protocol and special chars)
      const normalizedUrl = url
        .replace(/^https?:\/\//, '')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
      return defineAction({
        name: `http-get-${normalizedUrl}`,
        description: `HTTP GET ${url}`,
        handler: async () => {
          const response = await fetch(url)
          return response.json()
        },
      })
    },
    post: (url: string, body?: any) => {
      // Normalize URL for action name (remove protocol and special chars)
      const normalizedUrl = url
        .replace(/^https?:\/\//, '')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
      return defineAction({
        name: `http-post-${normalizedUrl}`,
        description: `HTTP POST ${url}`,
        handler: async (params) => {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body || params),
          })
          return response.json()
        },
      })
    },
  },

  /**
   * Built-in transform actions
   */
  transform: {
    map: (fn: (item: any) => any) =>
      defineAction({
        name: 'transform-map-inline',
        description: 'Map transform',
        handler: async (data) => {
          if (Array.isArray(data)) return data.map(fn)
          return fn(data)
        },
      }),
    filter: (fn: (item: any) => boolean) =>
      defineAction({
        name: 'transform-filter-inline',
        description: 'Filter transform',
        handler: async (data: any[]) => data.filter(fn),
      }),
    reduce: (fn: (acc: any, item: any) => any, initial?: any) =>
      defineAction({
        name: 'transform-reduce-inline',
        description: 'Reduce transform',
        handler: async (data: any[]) => data.reduce(fn, initial),
      }),
  },
}
