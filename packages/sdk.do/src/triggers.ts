/**
 * Triggers Service for .do SDK
 *
 * Provides event-based triggers for workflows and automation. Triggers listen for events
 * and can conditionally execute actions based on patterns, filters, and predicates.
 *
 * Features:
 * - Event pattern matching (glob, regex, semantic patterns)
 * - Conditional evaluation with filters and predicates
 * - Trigger registration and management
 * - Trigger lifecycle (enable, disable, delete)
 * - Trigger history and monitoring
 * - Schedule-based triggers (cron, semantic intervals)
 * - Integration with workflows and actions
 *
 * @example
 * ```typescript
 * import { defineTrigger, triggers, $ } from 'sdk.do'
 *
 * // Define a trigger
 * const onNewOrder = defineTrigger({
 *   name: 'on-new-order',
 *   description: 'Trigger when new order is created',
 *   event: '$.Order.created',
 *   condition: async (event) => {
 *     return event.payload.total > 100
 *   },
 *   action: async (event) => {
 *     await $.workflow.start('process-order', event.payload)
 *   }
 * })
 *
 * // Register trigger
 * await onNewOrder.register()
 *
 * // Built-in trigger patterns
 * await triggers.on('user.created', async (event) => {
 *   await $.actions.sendEmail({ to: event.payload.email })
 * })
 *
 * // Pattern matching
 * await triggers.on('order.*', handler)  // All order events
 * await triggers.on(/^payment\.(success|failed)$/, handler) // Regex
 *
 * // Conditional triggers
 * await triggers.when('user.login', {
 *   condition: (event) => event.payload.isNewDevice,
 *   action: async (event) => {
 *     await $.events.publish('security.alert', event.payload)
 *   }
 * })
 *
 * // Schedule-based triggers
 * await triggers.every('0 9 * * *', {
 *   action: async () => {
 *     await $.workflow.start('daily-report')
 *   }
 * })
 * ```
 */

import type { BusinessEvent } from './on'

/**
 * Event pattern types for trigger matching
 */
export type TriggerEventPattern =
  | string // Simple pattern: 'Order.created' or glob: 'order.*'
  | RegExp // Regex pattern: /^order\.(created|updated)$/
  | ((event: any) => boolean | Promise<boolean>) // Custom filter function

/**
 * Condition function for conditional triggers
 */
export type TriggerCondition<TPayload = any> = (event: TriggerEvent<TPayload>) => boolean | Promise<boolean>

/**
 * Action function executed when trigger fires
 */
export type TriggerAction<TPayload = any> = (event: TriggerEvent<TPayload>) => void | Promise<void>

/**
 * Trigger priority levels
 */
export type TriggerPriority = 'low' | 'normal' | 'high' | 'critical'

/**
 * Trigger status
 */
export type TriggerStatus = 'active' | 'paused' | 'disabled' | 'error'

/**
 * Event structure for triggers
 */
export interface TriggerEvent<TPayload = any> {
  /**
   * Event ID
   */
  id: string

  /**
   * Event type/pattern
   */
  type: string

  /**
   * Event payload
   */
  payload: TPayload

  /**
   * Event timestamp (ISO 8601)
   */
  timestamp: string

  /**
   * Event metadata
   */
  metadata?: Record<string, any>

  /**
   * Event source
   */
  source?: string
}

/**
 * Trigger definition
 */
export interface TriggerDefinition<TPayload = any> {
  /**
   * Unique trigger name
   */
  name: string

  /**
   * Trigger description
   */
  description?: string

  /**
   * Event pattern to match
   */
  event: TriggerEventPattern

  /**
   * Optional condition to evaluate before executing action
   */
  condition?: TriggerCondition<TPayload>

  /**
   * Action to execute when trigger fires
   */
  action: TriggerAction<TPayload>

  /**
   * Trigger priority
   * @default 'normal'
   */
  priority?: TriggerPriority

  /**
   * Whether trigger is enabled
   * @default true
   */
  enabled?: boolean

  /**
   * Maximum executions (-1 for unlimited)
   * @default -1
   */
  maxExecutions?: number

  /**
   * Cooldown period (milliseconds) between executions
   * @default 0
   */
  cooldown?: number

  /**
   * Timeout for action execution (milliseconds)
   * @default 30000
   */
  timeout?: number

  /**
   * Retry configuration
   */
  retry?: {
    /**
     * Maximum retry attempts
     * @default 3
     */
    max?: number

    /**
     * Backoff strategy
     * @default 'exponential'
     */
    backoff?: 'linear' | 'exponential' | 'fixed'

    /**
     * Initial delay (milliseconds)
     * @default 1000
     */
    delay?: number

    /**
     * Maximum delay (milliseconds)
     * @default 60000
     */
    maxDelay?: number
  }

  /**
   * Trigger metadata
   */
  metadata?: Record<string, any>
}

/**
 * Registered trigger information
 */
export interface RegisteredTrigger {
  /**
   * Trigger ID
   */
  id: string

  /**
   * Trigger name
   */
  name: string

  /**
   * Trigger description
   */
  description?: string

  /**
   * Event pattern (serialized)
   */
  pattern: string

  /**
   * Trigger status
   */
  status: TriggerStatus

  /**
   * Priority level
   */
  priority: TriggerPriority

  /**
   * Execution count
   */
  executionCount: number

  /**
   * Success count
   */
  successCount: number

  /**
   * Failure count
   */
  failureCount: number

  /**
   * Last execution timestamp
   */
  lastExecutedAt?: string

  /**
   * Next execution timestamp (for scheduled triggers)
   */
  nextExecutionAt?: string

  /**
   * Created at
   */
  createdAt: string

  /**
   * Updated at
   */
  updatedAt: string

  /**
   * Metadata
   */
  metadata?: Record<string, any>
}

/**
 * Trigger execution result
 */
export interface TriggerExecutionResult {
  /**
   * Execution ID
   */
  id: string

  /**
   * Trigger ID
   */
  triggerId: string

  /**
   * Event that triggered execution
   */
  event: TriggerEvent

  /**
   * Whether execution was successful
   */
  success: boolean

  /**
   * Action result (if successful)
   */
  result?: any

  /**
   * Error (if failed)
   */
  error?: {
    message: string
    code?: string
    stack?: string
  }

  /**
   * Execution duration (milliseconds)
   */
  duration: number

  /**
   * Started at
   */
  startedAt: string

  /**
   * Completed at
   */
  completedAt: string

  /**
   * Retry count
   */
  retryCount?: number
}

/**
 * Trigger history query options
 */
export interface TriggerHistoryOptions {
  /**
   * Start time (ISO 8601)
   */
  from?: string

  /**
   * End time (ISO 8601)
   */
  to?: string

  /**
   * Maximum results
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number

  /**
   * Filter by success/failure
   */
  success?: boolean

  /**
   * Sort order
   */
  order?: 'asc' | 'desc'
}

/**
 * Trigger metrics
 */
export interface TriggerMetrics {
  /**
   * Trigger ID
   */
  triggerId: string

  /**
   * Total executions
   */
  totalExecutions: number

  /**
   * Successful executions
   */
  successfulExecutions: number

  /**
   * Failed executions
   */
  failedExecutions: number

  /**
   * Success rate (0-1)
   */
  successRate: number

  /**
   * Average execution duration (milliseconds)
   */
  avgDuration: number

  /**
   * Minimum execution duration (milliseconds)
   */
  minDuration: number

  /**
   * Maximum execution duration (milliseconds)
   */
  maxDuration: number

  /**
   * Last execution timestamp
   */
  lastExecutedAt?: string

  /**
   * Error breakdown
   */
  errors: Array<{
    message: string
    count: number
  }>

  /**
   * Time range
   */
  timeRange: {
    from: string
    to: string
  }
}

/**
 * List triggers options
 */
export interface ListTriggersOptions {
  /**
   * Filter by status
   */
  status?: TriggerStatus

  /**
   * Filter by priority
   */
  priority?: TriggerPriority

  /**
   * Filter by pattern
   */
  pattern?: string

  /**
   * Maximum results
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number

  /**
   * Sort by field
   */
  sortBy?: 'name' | 'createdAt' | 'executionCount' | 'priority'

  /**
   * Sort order
   */
  order?: 'asc' | 'desc'
}

/**
 * Trigger service configuration
 */
export interface TriggersServiceConfig {
  /**
   * Triggers API URL
   * @default process.env.TRIGGERS_API_URL || 'https://triggers.do'
   */
  apiUrl?: string

  /**
   * API key for authentication
   */
  apiKey?: string

  /**
   * Enable telemetry
   * @default true
   */
  telemetry?: boolean
}

/**
 * Trigger instance returned by defineTrigger
 */
export class Trigger<TPayload = any> {
  private definition: TriggerDefinition<TPayload>
  private config: Required<Omit<TriggersServiceConfig, 'apiKey'>> & { apiKey?: string }
  private registeredId?: string

  constructor(definition: TriggerDefinition<TPayload>, config: TriggersServiceConfig = {}) {
    this.definition = definition
    this.config = {
      apiUrl: config.apiUrl || process.env.TRIGGERS_API_URL || 'https://triggers.do',
      telemetry: config.telemetry !== false,
      apiKey: config.apiKey || process.env.DO_TOKEN,
    }
  }

  /**
   * Register the trigger
   */
  async register(): Promise<RegisteredTrigger> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: this.definition.name,
        description: this.definition.description,
        pattern: this.serializePattern(this.definition.event),
        priority: this.definition.priority || 'normal',
        enabled: this.definition.enabled !== false,
        maxExecutions: this.definition.maxExecutions ?? -1,
        cooldown: this.definition.cooldown ?? 0,
        timeout: this.definition.timeout ?? 30000,
        retry: this.definition.retry,
        metadata: this.definition.metadata,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to register trigger: ${response.status} ${error}`)
    }

    const result = (await response.json()) as RegisteredTrigger
    this.registeredId = result.id

    if (this.config.telemetry) {
      console.log(`[triggers] Registered trigger: ${this.definition.name}`, { id: result.id })
    }

    return result
  }

  /**
   * Unregister the trigger
   */
  async unregister(): Promise<void> {
    if (!this.registeredId) {
      throw new Error('Trigger is not registered')
    }

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${this.registeredId}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to unregister trigger: ${response.status} ${error}`)
    }

    if (this.config.telemetry) {
      console.log(`[triggers] Unregistered trigger: ${this.definition.name}`, { id: this.registeredId })
    }

    this.registeredId = undefined
  }

  /**
   * Enable the trigger
   */
  async enable(): Promise<void> {
    if (!this.registeredId) {
      throw new Error('Trigger is not registered')
    }

    await this.updateStatus('active')
  }

  /**
   * Disable the trigger
   */
  async disable(): Promise<void> {
    if (!this.registeredId) {
      throw new Error('Trigger is not registered')
    }

    await this.updateStatus('disabled')
  }

  /**
   * Pause the trigger
   */
  async pause(): Promise<void> {
    if (!this.registeredId) {
      throw new Error('Trigger is not registered')
    }

    await this.updateStatus('paused')
  }

  /**
   * Get trigger info
   */
  async info(): Promise<RegisteredTrigger> {
    if (!this.registeredId) {
      throw new Error('Trigger is not registered')
    }

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${this.registeredId}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get trigger info: ${response.status} ${error}`)
    }

    return (await response.json()) as RegisteredTrigger
  }

  /**
   * Get trigger metrics
   */
  async metrics(): Promise<TriggerMetrics> {
    if (!this.registeredId) {
      throw new Error('Trigger is not registered')
    }

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${this.registeredId}/metrics`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get trigger metrics: ${response.status} ${error}`)
    }

    return (await response.json()) as TriggerMetrics
  }

  /**
   * Get trigger history
   */
  async history(options: TriggerHistoryOptions = {}): Promise<TriggerExecutionResult[]> {
    if (!this.registeredId) {
      throw new Error('Trigger is not registered')
    }

    const params = new URLSearchParams()
    if (options.from) params.set('from', options.from)
    if (options.to) params.set('to', options.to)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())
    if (options.success !== undefined) params.set('success', options.success.toString())
    if (options.order) params.set('order', options.order)

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${this.registeredId}/history?${params}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get trigger history: ${response.status} ${error}`)
    }

    const result = (await response.json()) as { executions?: TriggerExecutionResult[] }
    return result.executions || []
  }

  /**
   * Get trigger definition
   */
  getDefinition(): Readonly<TriggerDefinition<TPayload>> {
    return { ...this.definition }
  }

  /**
   * Get trigger ID (if registered)
   */
  getId(): string | undefined {
    return this.registeredId
  }

  /**
   * Internal: Update trigger status
   */
  private async updateStatus(status: TriggerStatus): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${this.registeredId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update trigger status: ${response.status} ${error}`)
    }

    if (this.config.telemetry) {
      console.log(`[triggers] Updated trigger status: ${this.definition.name} -> ${status}`)
    }
  }

  /**
   * Internal: Serialize event pattern for API
   */
  private serializePattern(pattern: TriggerEventPattern): string {
    if (typeof pattern === 'string') {
      return pattern
    } else if (pattern instanceof RegExp) {
      return `regex:${pattern.source}`
    } else {
      return 'function:custom'
    }
  }
}

/**
 * Triggers service for managing triggers
 */
export class TriggersService {
  private config: Required<Omit<TriggersServiceConfig, 'apiKey'>> & { apiKey?: string }

  constructor(config: TriggersServiceConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || process.env.TRIGGERS_API_URL || 'https://triggers.do',
      telemetry: config.telemetry !== false,
      apiKey: config.apiKey || process.env.DO_TOKEN,
    }
  }

  /**
   * Register a trigger with event pattern and action
   *
   * @example
   * ```typescript
   * const triggerId = await triggers.on('user.created', async (event) => {
   *   await sendWelcomeEmail(event.payload.email)
   * })
   * ```
   */
  async on<TPayload = any>(pattern: TriggerEventPattern, action: TriggerAction<TPayload>, options?: Partial<TriggerDefinition<TPayload>>): Promise<string> {
    const definition: TriggerDefinition<TPayload> = {
      name: options?.name || `trigger-${Date.now()}`,
      description: options?.description,
      event: pattern,
      action,
      priority: options?.priority || 'normal',
      enabled: options?.enabled !== false,
      maxExecutions: options?.maxExecutions ?? -1,
      cooldown: options?.cooldown ?? 0,
      timeout: options?.timeout ?? 30000,
      retry: options?.retry,
      metadata: options?.metadata,
    }

    const trigger = new Trigger(definition, this.config)
    const registered = await trigger.register()
    return registered.id
  }

  /**
   * Register a conditional trigger
   *
   * @example
   * ```typescript
   * await triggers.when('user.login', {
   *   condition: (event) => event.payload.isNewDevice,
   *   action: async (event) => {
   *     await sendSecurityAlert(event.payload)
   *   }
   * })
   * ```
   */
  async when<TPayload = any>(
    pattern: TriggerEventPattern,
    config: {
      condition: TriggerCondition<TPayload>
      action: TriggerAction<TPayload>
      priority?: TriggerPriority
      metadata?: Record<string, any>
    }
  ): Promise<string> {
    return this.on(pattern, config.action, {
      name: `when-${Date.now()}`,
      condition: config.condition,
      priority: config.priority,
      metadata: config.metadata,
    })
  }

  /**
   * Register a schedule-based trigger
   *
   * @example
   * ```typescript
   * await triggers.every('0 9 * * *', {
   *   action: async () => {
   *     await runDailyReport()
   *   }
   * })
   * ```
   */
  async every(schedule: string, config: { action: TriggerAction; metadata?: Record<string, any> }): Promise<string> {
    return this.on(`schedule:${schedule}`, config.action, {
      name: `schedule-${Date.now()}`,
      metadata: { ...config.metadata, schedule },
    })
  }

  /**
   * List all triggers
   *
   * @example
   * ```typescript
   * const triggers = await triggers.list({ status: 'active' })
   * ```
   */
  async list(options: ListTriggersOptions = {}): Promise<RegisteredTrigger[]> {
    const params = new URLSearchParams()
    if (options.status) params.set('status', options.status)
    if (options.priority) params.set('priority', options.priority)
    if (options.pattern) params.set('pattern', options.pattern)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())
    if (options.sortBy) params.set('sortBy', options.sortBy)
    if (options.order) params.set('order', options.order)

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers?${params}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list triggers: ${response.status} ${error}`)
    }

    const result = (await response.json()) as { triggers?: RegisteredTrigger[] }
    return result.triggers || []
  }

  /**
   * Get trigger by ID
   *
   * @example
   * ```typescript
   * const trigger = await triggers.get('trigger-123')
   * ```
   */
  async get(triggerId: string): Promise<RegisteredTrigger> {
    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${triggerId}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get trigger: ${response.status} ${error}`)
    }

    return (await response.json()) as RegisteredTrigger
  }

  /**
   * Enable a trigger
   *
   * @example
   * ```typescript
   * await triggers.enable('trigger-123')
   * ```
   */
  async enable(triggerId: string): Promise<void> {
    await this.updateStatus(triggerId, 'active')
  }

  /**
   * Disable a trigger
   *
   * @example
   * ```typescript
   * await triggers.disable('trigger-123')
   * ```
   */
  async disable(triggerId: string): Promise<void> {
    await this.updateStatus(triggerId, 'disabled')
  }

  /**
   * Pause a trigger
   *
   * @example
   * ```typescript
   * await triggers.pause('trigger-123')
   * ```
   */
  async pause(triggerId: string): Promise<void> {
    await this.updateStatus(triggerId, 'paused')
  }

  /**
   * Delete a trigger
   *
   * @example
   * ```typescript
   * await triggers.delete('trigger-123')
   * ```
   */
  async delete(triggerId: string): Promise<void> {
    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${triggerId}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete trigger: ${response.status} ${error}`)
    }

    if (this.config.telemetry) {
      console.log(`[triggers] Deleted trigger: ${triggerId}`)
    }
  }

  /**
   * Get trigger history
   *
   * @example
   * ```typescript
   * const history = await triggers.history('trigger-123', {
   *   from: '2025-01-01',
   *   limit: 100
   * })
   * ```
   */
  async history(triggerId: string, options: TriggerHistoryOptions = {}): Promise<TriggerExecutionResult[]> {
    const params = new URLSearchParams()
    if (options.from) params.set('from', options.from)
    if (options.to) params.set('to', options.to)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())
    if (options.success !== undefined) params.set('success', options.success.toString())
    if (options.order) params.set('order', options.order)

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${triggerId}/history?${params}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get trigger history: ${response.status} ${error}`)
    }

    const result = (await response.json()) as { executions?: TriggerExecutionResult[] }
    return result.executions || []
  }

  /**
   * Get trigger metrics
   *
   * @example
   * ```typescript
   * const metrics = await triggers.metrics('trigger-123')
   * console.log('Success rate:', metrics.successRate)
   * ```
   */
  async metrics(triggerId: string): Promise<TriggerMetrics> {
    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${triggerId}/metrics`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get trigger metrics: ${response.status} ${error}`)
    }

    return (await response.json()) as TriggerMetrics
  }

  /**
   * Internal: Update trigger status
   */
  private async updateStatus(triggerId: string, status: TriggerStatus): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.apiUrl}/triggers/${triggerId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update trigger status: ${response.status} ${error}`)
    }

    if (this.config.telemetry) {
      console.log(`[triggers] Updated trigger status: ${triggerId} -> ${status}`)
    }
  }
}

/**
 * Define a trigger
 *
 * @example
 * ```typescript
 * const onNewOrder = defineTrigger({
 *   name: 'on-new-order',
 *   description: 'Process high-value orders',
 *   event: '$.Order.created',
 *   condition: async (event) => {
 *     return event.payload.total > 100
 *   },
 *   action: async (event) => {
 *     await $.workflow.start('process-order', event.payload)
 *   },
 *   priority: 'high'
 * })
 *
 * await onNewOrder.register()
 * ```
 */
export function defineTrigger<TPayload = any>(definition: TriggerDefinition<TPayload>, config?: TriggersServiceConfig): Trigger<TPayload> {
  return new Trigger(definition, config)
}

/**
 * Create a triggers service
 *
 * @example
 * ```typescript
 * const triggers = createTriggersService({
 *   apiUrl: 'https://triggers.do',
 *   apiKey: process.env.DO_TOKEN
 * })
 *
 * await triggers.on('user.created', async (event) => {
 *   console.log('New user:', event.payload)
 * })
 * ```
 */
export function createTriggersService(config?: TriggersServiceConfig): TriggersService {
  return new TriggersService(config)
}

/**
 * Default TriggersService instance
 */
export const triggers = createTriggersService()
