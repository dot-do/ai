/**
 * Event Listener System for .do SDK
 *
 * Supports semantic event patterns:
 * - $.Order.created - Listen to Order creation events
 * - $.Customer.updated - Listen to Customer updates
 * - $.Payment.failed - Listen to payment failures
 *
 * Integrates with:
 * - graphdl BusinessEvent types (5W1H pattern)
 * - Zapier trigger patterns
 * - NAICS industry events
 * - O*NET occupation-based events
 */

// Temporary BusinessEvent type until graphdl exports it
// TODO: Import from graphdl once events.ts is exported
export interface BusinessEvent<T = any> {
  who: any // Actor (Person, Organization, Agent, System)
  what: T & { $type: string; $id?: string } // The subject/object of the event
  when: string // ISO 8601 timestamp
  where: any // Location
  why?: any // Reason/context
  how?: any // Method/mechanism
  metadata?: {
    action?: string // The predicate/verb (e.g., 'created', 'updated')
    verb?: string // Alternative to action
    [key: string]: any
  }
}

// Temporary type guard until graphdl exports it
function isBusinessEvent(event: any): event is BusinessEvent {
  return (
    event &&
    typeof event === 'object' &&
    'who' in event &&
    'what' in event &&
    'when' in event &&
    'where' in event &&
    event.what &&
    typeof event.what === 'object' &&
    '$type' in event.what
  )
}

/**
 * Event handler function type
 */
export type EventHandler<T = any> = (event: BusinessEvent<T>) => void | Promise<void>

/**
 * Result of executing a single event handler
 */
export interface ExecutionResult {
  listenerId: string
  success: boolean
  result?: any
  error?: Error
  timedOut?: boolean
}

/**
 * Error handler callback
 */
export type ErrorHandler = (listenerId: string, error: Error, event: BusinessEvent) => void | Promise<void>

/**
 * Middleware function types
 */
export type BeforeMiddleware = (event: BusinessEvent) => BusinessEvent | Promise<BusinessEvent>
export type AfterMiddleware = (event: BusinessEvent, result: any) => void | Promise<void>

/**
 * Event listener options
 */
export interface EventListenerOptions {
  /**
   * Filter events by actor type (who)
   * @example { $type: 'Person', role: 'customer' }
   */
  who?: Partial<BusinessEvent['who']>

  /**
   * Filter events by location (where)
   * @example { digital: { platform: 'web' } }
   */
  where?: Partial<BusinessEvent['where']>

  /**
   * Filter events by purpose (why)
   * @example { reason: 'customer-purchase' }
   */
  why?: Partial<BusinessEvent['why']>

  /**
   * Filter events by method (how)
   * @example { method: 'api' }
   */
  how?: Partial<BusinessEvent['how']>

  /**
   * Filter events by temporal pattern (when)
   * @example '0 0 * * *' (daily at midnight)
   */
  when?: string

  /**
   * Additional metadata filters
   */
  metadata?: Record<string, any>

  /**
   * Priority for handler execution (higher = earlier)
   * @default 0
   */
  priority?: number

  /**
   * Maximum number of times to execute handler
   * @example 1 (execute once, then remove)
   */
  maxExecutions?: number

  /**
   * Handler timeout in milliseconds
   * @example 5000 (5 seconds)
   */
  timeout?: number

  /**
   * Listener group for namespaced management
   * @example 'analytics'
   */
  group?: string

  /**
   * Error handler callback
   */
  onError?: ErrorHandler

  /**
   * Before middleware - transforms event before handler execution
   */
  before?: BeforeMiddleware

  /**
   * After middleware - runs after handler execution
   */
  after?: AfterMiddleware

  /**
   * Auto-remove listener on handler error
   * @default false
   */
  removeOnError?: boolean

  /**
   * Auto-remove listener on timeout
   * @default false
   */
  removeOnTimeout?: boolean
}

/**
 * Event pattern types for semantic routing
 */
export type EventPattern =
  | string // Simple pattern: 'Order.created'
  | RegExp // Regex pattern: /Order\.(created|updated)/
  | ((event: BusinessEvent) => boolean | Promise<boolean>) // Custom filter function (sync or async)

/**
 * Registered event listener
 */
interface EventListener {
  pattern: EventPattern
  handler: EventHandler
  options: EventListenerOptions
  executionCount: number
  id: string
}

/**
 * Type guard to check if an object has a specific property
 */
function hasProperty<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj
}

/**
 * Type guard to check if value is a record
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Safely get a string property from an object
 * Returns undefined if property doesn't exist or is not a string
 */
function getStringProperty<T extends Record<string, unknown>>(obj: T | unknown, key: string): string | undefined {
  if (!isRecord(obj)) return undefined
  if (!hasProperty(obj, key)) return undefined
  const value = obj[key]
  return typeof value === 'string' ? value : undefined
}

/**
 * Telemetry hooks for monitoring event system performance
 */
export interface TelemetryHooks {
  /**
   * Called when an event is emitted
   */
  onEventEmit?: (event: BusinessEvent) => void

  /**
   * Called when a handler starts execution
   */
  onHandlerStart?: (listenerId: string, event: BusinessEvent) => void

  /**
   * Called when a handler completes successfully
   */
  onHandlerSuccess?: (listenerId: string, event: BusinessEvent, durationMs: number) => void

  /**
   * Called when a handler fails
   */
  onHandlerError?: (listenerId: string, event: BusinessEvent, error: Error, durationMs: number) => void

  /**
   * Called when a handler times out
   */
  onHandlerTimeout?: (listenerId: string, event: BusinessEvent, timeoutMs: number) => void
}

/**
 * Registry configuration options
 */
export interface RegistryConfig {
  /**
   * Maximum number of listeners per pattern
   * @default Infinity
   */
  maxListenersPerPattern?: number

  /**
   * Maximum total number of listeners
   * @default Infinity
   */
  maxTotalListeners?: number

  /**
   * Default handler timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  defaultTimeout?: number

  /**
   * Maximum regex complexity (number of operators)
   * @default 50
   */
  maxRegexComplexity?: number

  /**
   * Default error logger function
   * @default console.error
   */
  errorLogger?: (message: string, error: Error) => void

  /**
   * Telemetry hooks for monitoring (optional)
   */
  telemetry?: TelemetryHooks
}

/**
 * Validate regex complexity to prevent ReDoS attacks
 *
 * NOTE: This is a simple heuristic that counts regex operators. It provides basic
 * protection against obviously complex patterns but may not catch all ReDoS vulnerabilities.
 * Patterns like (a+)+ can still cause catastrophic backtracking despite low operator counts.
 *
 * For production systems with untrusted regex inputs, consider using a more sophisticated
 * ReDoS detection library like 'safe-regex2' or 'recheck'.
 */
function validateRegexComplexity(pattern: RegExp, maxComplexity: number): void {
  const source = pattern.source
  // Count regex operators as a simple complexity measure
  const operators = source.match(/[*+?{}\[\]()|\\.^$]/g) || []
  if (operators.length > maxComplexity) {
    throw new Error(`Regex pattern too complex: ${operators.length} operators exceeds limit of ${maxComplexity}`)
  }
}

/**
 * Validate that filter objects don't contain nested objects (which aren't supported)
 * Deep equality checks are expensive and error-prone, so we only support shallow filters.
 */
function validateFilterDepth(filter: any, filterName: string, path = ''): void {
  if (!isRecord(filter)) return

  for (const [key, value] of Object.entries(filter)) {
    // Skip $type as it's a special case and allowed
    if (key === '$type') continue

    // If value is a plain object (not null, not array), it's nested
    if (isRecord(value)) {
      const fullPath = path ? `${path}.${key}` : key
      throw new Error(
        `Nested object filters are not supported in '${filterName}.${fullPath}'. ` +
          `Use a custom filter function instead:\n` +
          `$.on((event) => event.${filterName}?.${fullPath} === yourValue, handler)`
      )
    }
  }
}

/**
 * Execute function with timeout
 * Handles race conditions properly and clears timeout safely using try-finally
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<{ result?: T; timedOut: boolean; error?: Error }> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let timedOutFlag = false

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      timedOutFlag = true
      reject(new Error('Handler timeout'))
    }, timeoutMs)
  })

  try {
    const result = await Promise.race([promise, timeoutPromise])
    return { result, timedOut: false }
  } catch (error) {
    if (timedOutFlag || (error instanceof Error && error.message === 'Handler timeout')) {
      return { timedOut: true }
    }
    return { error: error instanceof Error ? error : new Error(String(error)), timedOut: false }
  } finally {
    // Always clear timeout in finally block to ensure cleanup even if unexpected errors occur
    if (timeoutId !== undefined) clearTimeout(timeoutId)
  }
}

/**
 * Event listener registry
 */
class EventListenerRegistry {
  private listeners: Map<string, EventListener[]> = new Map()
  private globalListeners: EventListener[] = []
  private listenerIdCounter = 0
  private config: Required<Omit<RegistryConfig, 'telemetry'>> & { telemetry?: TelemetryHooks }

  constructor(config: RegistryConfig = {}) {
    this.config = {
      maxListenersPerPattern: config.maxListenersPerPattern ?? Infinity,
      maxTotalListeners: config.maxTotalListeners ?? Infinity,
      defaultTimeout: config.defaultTimeout ?? 30000,
      maxRegexComplexity: config.maxRegexComplexity ?? 50,
      errorLogger: config.errorLogger ?? ((message: string, error: Error) => console.error(message, error)),
      telemetry: config.telemetry,
    }
  }

  /**
   * Get total number of listeners
   */
  private getTotalListenerCount(): number {
    let count = this.globalListeners.length
    for (const listeners of this.listeners.values()) {
      count += listeners.length
    }
    return count
  }

  /**
   * Get listener count for a specific pattern
   */
  private getPatternListenerCount(subject: string): number {
    return this.listeners.get(subject)?.length ?? 0
  }

  /**
   * Register an event listener
   */
  register(pattern: EventPattern, handler: EventHandler, options: EventListenerOptions = {}): string {
    // Check total listener limit
    if (this.getTotalListenerCount() >= this.config.maxTotalListeners) {
      throw new Error(`Maximum total listeners (${this.config.maxTotalListeners}) exceeded`)
    }

    // Validate filter depth - prevent nested objects which aren't supported
    if (options.who) validateFilterDepth(options.who, 'who')
    if (options.where) validateFilterDepth(options.where, 'where')
    if (options.why) validateFilterDepth(options.why, 'why')
    if (options.how) validateFilterDepth(options.how, 'how')
    if (options.metadata) validateFilterDepth(options.metadata, 'metadata')

    // Normalize regex patterns: create stateless version during registration
    let normalizedPattern = pattern
    if (pattern instanceof RegExp) {
      validateRegexComplexity(pattern, this.config.maxRegexComplexity)
      // Remove global and sticky flags to prevent stateful matching issues
      if (pattern.global || pattern.sticky) {
        normalizedPattern = new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, ''))
      }
    }

    const id = `listener_${++this.listenerIdCounter}`
    const listener: EventListener = {
      pattern: normalizedPattern,
      handler,
      options,
      executionCount: 0,
      id,
    }

    if (typeof pattern === 'string') {
      // Extract event type from pattern for efficient lookup
      // Pattern format: 'Subject.predicate' or 'Subject.predicate.Object'
      const [subject] = pattern.split('.')

      // Check per-pattern listener limit
      if (this.getPatternListenerCount(subject) >= this.config.maxListenersPerPattern) {
        throw new Error(`Maximum listeners per pattern (${this.config.maxListenersPerPattern}) exceeded for pattern: ${subject}`)
      }

      if (!this.listeners.has(subject)) {
        this.listeners.set(subject, [])
      }
      this.listeners.get(subject)!.push(listener)
    } else {
      // Regex or function patterns need to check against all events
      this.globalListeners.push(listener)
    }

    return id
  }

  /**
   * Unregister an event listener
   */
  unregister(id: string): boolean {
    // Check subject-specific listeners
    for (const [subject, listeners] of this.listeners.entries()) {
      const index = listeners.findIndex((l) => l.id === id)
      if (index !== -1) {
        listeners.splice(index, 1)
        if (listeners.length === 0) {
          this.listeners.delete(subject)
        }
        return true
      }
    }

    // Check global listeners
    const globalIndex = this.globalListeners.findIndex((l) => l.id === id)
    if (globalIndex !== -1) {
      this.globalListeners.splice(globalIndex, 1)
      return true
    }

    return false
  }

  /**
   * Unregister all listeners in a group
   */
  unregisterGroup(group: string): number {
    let count = 0

    // Remove from subject-specific listeners
    for (const [subject, listeners] of this.listeners.entries()) {
      const before = listeners.length
      const filtered = listeners.filter((l) => l.options.group !== group)
      count += before - filtered.length
      if (filtered.length === 0) {
        this.listeners.delete(subject)
      } else if (filtered.length !== before) {
        this.listeners.set(subject, filtered)
      }
    }

    // Remove from global listeners
    const before = this.globalListeners.length
    this.globalListeners = this.globalListeners.filter((l) => l.options.group !== group)
    count += before - this.globalListeners.length

    return count
  }

  /**
   * Get all listeners matching an event
   */
  async getMatchingListeners(event: BusinessEvent): Promise<EventListener[]> {
    // Extract subject from event data using safe property access
    const eventType = getStringProperty(event.what, '$type') ?? getStringProperty(event.what, 'type')

    // Collect all listeners to check (subject-specific + global)
    const listenersToCheck: EventListener[] = []
    if (eventType && this.listeners.has(eventType)) {
      listenersToCheck.push(...this.listeners.get(eventType)!)
    }
    listenersToCheck.push(...this.globalListeners)

    // Parallel pattern matching for better performance
    const matchResults = await Promise.all(
      listenersToCheck.map(async (listener) => ({
        listener,
        matches: (await this.matchesPattern(event, listener.pattern)) && this.matchesFilters(event, listener.options),
      }))
    )

    // Filter matched listeners and sort by priority (higher priority first)
    const matching = matchResults.filter((r) => r.matches).map((r) => r.listener)
    return matching.sort((a, b) => (b.options.priority || 0) - (a.options.priority || 0))
  }

  /**
   * Check if event matches pattern
   */
  private async matchesPattern(event: BusinessEvent, pattern: EventPattern): Promise<boolean> {
    if (typeof pattern === 'string') {
      // Simple string pattern matching
      // Pattern: 'Order.created' matches events with what.$type = 'Order' and metadata.action = 'created'
      const [subject, predicate, object] = pattern.split('.')

      // Use safe property extraction
      const eventType = getStringProperty(event.what, '$type') ?? getStringProperty(event.what, 'type')
      const eventAction = getStringProperty(event.metadata, 'action') ?? getStringProperty(event.metadata, 'verb')

      // Warn if pattern expects action but event doesn't have one
      if (predicate && !eventAction) {
        this.config.errorLogger(
          `Event pattern '${pattern}' expects action but event has no metadata.action or metadata.verb. Event will not match.`,
          new Error('Missing event metadata')
        )
        return false
      }

      if (subject && eventType !== subject) return false
      if (predicate && eventAction !== predicate) return false
      if (object) {
        // Check if object matches (for patterns like 'Order.created.Product')
        const whatObject = isRecord(event.what) && hasProperty(event.what, 'object') ? event.what.object : undefined
        const eventObject = getStringProperty(whatObject, '$type')
        if (eventObject !== object) return false
      }

      return true
    } else if (pattern instanceof RegExp) {
      // Regex pattern matching against semantic path only (not entire event)
      // Build semantic path: Subject.predicate or Subject.predicate.Object
      const eventType = getStringProperty(event.what, '$type') ?? getStringProperty(event.what, 'type') ?? ''
      const eventAction = getStringProperty(event.metadata, 'action') ?? getStringProperty(event.metadata, 'verb') ?? ''

      let eventObject = ''
      const whatObject = isRecord(event.what) && hasProperty(event.what, 'object') ? event.what.object : undefined
      if (whatObject) {
        eventObject = getStringProperty(whatObject, '$type') ?? ''
      }

      const semanticPath = eventObject ? `${eventType}.${eventAction}.${eventObject}` : `${eventType}.${eventAction}`
      // Pattern is already normalized during registration (no global/sticky flags)
      return pattern.test(semanticPath)
    } else if (typeof pattern === 'function') {
      // Custom filter function (supports both sync and async)
      const result = pattern(event)
      return result instanceof Promise ? await result : result
    }

    return false
  }

  /**
   * Check if event matches filter options
   */
  private matchesFilters(event: BusinessEvent, options: EventListenerOptions): boolean {
    // Filter by who (actor)
    if (options.who) {
      if (options.who.$type && event.who.$type !== options.who.$type) return false
      // Check other actor properties
      for (const [key, value] of Object.entries(options.who)) {
        if (key !== '$type' && isRecord(event.who) && hasProperty(event.who, key)) {
          // Add type checking before comparison
          if (typeof event.who[key] !== typeof value || event.who[key] !== value) return false
        } else if (key !== '$type') {
          return false // Property doesn't exist
        }
      }
    }

    // Filter by where (location)
    if (options.where) {
      if (options.where.digital) {
        if (!isRecord(event.where.digital)) return false
        for (const [key, value] of Object.entries(options.where.digital)) {
          if (!hasProperty(event.where.digital, key) || typeof event.where.digital[key] !== typeof value || event.where.digital[key] !== value) {
            return false
          }
        }
      }
      // Add more location filters as needed
    }

    // Filter by why (purpose)
    if (options.why) {
      if (!isRecord(event.why)) return false
      for (const [key, value] of Object.entries(options.why)) {
        if (!hasProperty(event.why, key) || typeof event.why[key] !== typeof value || event.why[key] !== value) {
          return false
        }
      }
    }

    // Filter by how (method)
    if (options.how) {
      if (!isRecord(event.how)) return false
      for (const [key, value] of Object.entries(options.how)) {
        if (!hasProperty(event.how, key) || typeof event.how[key] !== typeof value || event.how[key] !== value) {
          return false
        }
      }
    }

    // Filter by metadata
    if (options.metadata) {
      if (!isRecord(event.metadata)) return false
      for (const [key, value] of Object.entries(options.metadata)) {
        if (!hasProperty(event.metadata, key) || typeof event.metadata[key] !== typeof value || event.metadata[key] !== value) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Execute handlers for an event
   * @returns Array of execution results for each handler
   */
  async execute(event: BusinessEvent): Promise<ExecutionResult[]> {
    // Validate that the event is a proper BusinessEvent
    if (!isBusinessEvent(event)) {
      throw new Error('Invalid event: not a BusinessEvent type')
    }

    // Telemetry: Event emission
    this.config.telemetry?.onEventEmit?.(event)

    const results: ExecutionResult[] = []
    const listeners = await this.getMatchingListeners(event)
    const toRemove: string[] = []

    try {
      for (const listener of listeners) {
        const startTime = Date.now()
        // Check max executions before execution
        const shouldExecute = !listener.options.maxExecutions || listener.executionCount < listener.options.maxExecutions

        if (!shouldExecute) {
          toRemove.push(listener.id)
          continue
        }

        try {
          // Telemetry: Handler start
          this.config.telemetry?.onHandlerStart?.(listener.id, event)

          // Apply before middleware if present
          let processedEvent = event
          if (listener.options.before) {
            const beforeResult = listener.options.before(processedEvent)
            processedEvent = beforeResult instanceof Promise ? await beforeResult : beforeResult
          }

          // Execute handler with timeout
          const timeout = listener.options.timeout ?? this.config.defaultTimeout
          const { result, timedOut, error: timeoutError } = await withTimeout(Promise.resolve(listener.handler(processedEvent)), timeout)

          const duration = Date.now() - startTime

          if (timedOut) {
            const timeoutErrorObj = new Error(`Handler timeout after ${timeout}ms`)
            results.push({
              listenerId: listener.id,
              success: false,
              error: timeoutErrorObj,
              timedOut: true,
            })

            // Telemetry: Handler timeout
            this.config.telemetry?.onHandlerTimeout?.(listener.id, event, timeout)

            // Call error handler if present
            if (listener.options.onError) {
              await listener.options.onError(listener.id, timeoutErrorObj, event)
            }

            // Auto-remove on timeout if requested
            if (listener.options.removeOnTimeout) {
              toRemove.push(listener.id)
            }
          } else if (timeoutError) {
            // Error from withTimeout that wasn't a timeout
            results.push({
              listenerId: listener.id,
              success: false,
              error: timeoutError,
            })

            // Telemetry: Handler error
            this.config.telemetry?.onHandlerError?.(listener.id, event, timeoutError, duration)

            // Call error handler if present
            if (listener.options.onError) {
              await listener.options.onError(listener.id, timeoutError, event)
            } else {
              this.config.errorLogger(`Error executing event listener ${listener.id}:`, timeoutError)
            }

            // Auto-remove on error if requested
            if (listener.options.removeOnError) {
              toRemove.push(listener.id)
            }
          } else {
            listener.executionCount++

            // Apply after middleware if present (catch errors separately)
            try {
              if (listener.options.after) {
                const afterResult = listener.options.after(processedEvent, result)
                if (afterResult instanceof Promise) {
                  await afterResult
                }
              }

              const finalDuration = Date.now() - startTime
              results.push({ listenerId: listener.id, success: true, result })

              // Telemetry: Handler success
              this.config.telemetry?.onHandlerSuccess?.(listener.id, event, finalDuration)
            } catch (afterError) {
              // After middleware error
              const finalDuration = Date.now() - startTime
              const errorObj = afterError instanceof Error ? afterError : new Error(String(afterError))
              results.push({
                listenerId: listener.id,
                success: false,
                error: errorObj,
              })

              // Telemetry: Handler error
              this.config.telemetry?.onHandlerError?.(listener.id, event, errorObj, finalDuration)

              // Call error handler if present
              if (listener.options.onError) {
                await listener.options.onError(listener.id, errorObj, event)
              } else {
                this.config.errorLogger(`Error in after middleware for listener ${listener.id}:`, errorObj)
              }

              // Auto-remove on error if requested
              if (listener.options.removeOnError) {
                toRemove.push(listener.id)
              }
            }

            // Mark for removal if reached max executions
            if (listener.options.maxExecutions && listener.executionCount >= listener.options.maxExecutions) {
              toRemove.push(listener.id)
            }
          }
        } catch (error) {
          const duration = Date.now() - startTime
          const errorObj = error instanceof Error ? error : new Error(String(error))
          results.push({
            listenerId: listener.id,
            success: false,
            error: errorObj,
          })

          // Telemetry: Handler error
          this.config.telemetry?.onHandlerError?.(listener.id, event, errorObj, duration)

          // Call error handler if present
          if (listener.options.onError) {
            await listener.options.onError(listener.id, errorObj, event)
          } else {
            this.config.errorLogger(`Error executing event listener ${listener.id}:`, errorObj)
          }

          // Auto-remove on error if requested
          if (listener.options.removeOnError) {
            toRemove.push(listener.id)
          }
        }
      }
    } finally {
      // Cleanup listeners after iteration (guaranteed to run even if error occurs)
      toRemove.forEach((id) => this.unregister(id))
    }

    return results
  }

  /**
   * Clear all listeners
   */
  clear(): void {
    this.listeners.clear()
    this.globalListeners = []
  }
}

/**
 * Durable subscription options for production use
 */
export interface DurableSubscriptionOptions {
  /**
   * Webhook URL for event delivery when not connected via WebSocket
   */
  webhookUrl?: string

  /**
   * User ID for authentication and authorization
   */
  userId?: string

  /**
   * Additional metadata
   */
  metadata?: Record<string, any>

  /**
   * Retry policy for failed deliveries
   */
  retryPolicy?: {
    maxAttempts: number
    backoff: 'linear' | 'exponential'
    initialDelay?: number
    maxDelay?: number
  }
}

/**
 * Durable subscription response
 */
export interface DurableSubscription {
  id: string
  pattern: string
  status: 'active' | 'paused' | 'failed'
  createdAt: number
  webhookUrl?: string
  userId?: string
  metadata?: Record<string, any>
}

/**
 * OnService interface
 */
export interface OnService {
  /**
   * Register an event listener (in-memory, for development)
   *
   * @example
   * // Listen to Order creation events
   * $.on('Order.created', async (event) => {
   *   console.log('Order created:', event.what)
   * })
   *
   * @example
   * // Listen to events with filters
   * $.on('Payment.failed', async (event) => {
   *   // Handle failed payment
   * }, {
   *   why: { reason: 'insufficient-funds' }
   * })
   *
   * @example
   * // Listen once
   * $.on('User.registered', async (event) => {
   *   // Send welcome email
   * }, {
   *   maxExecutions: 1
   * })
   */
  (pattern: EventPattern, handler: EventHandler, options?: EventListenerOptions): string

  /**
   * Create a durable event subscription (queue-backed, for production)
   *
   * @example
   * // Create durable subscription with webhook
   * const subscription = await $.on.durable('Order.created', {
   *   webhookUrl: 'https://my-app.com/webhooks/orders',
   *   retryPolicy: {
   *     maxAttempts: 5,
   *     backoff: 'exponential'
   *   }
   * })
   *
   * @example
   * // Resume subscription with WebSocket
   * const ws = await $.on.resume(subscription.id)
   * ws.onmessage = (msg) => {
   *   const { event } = JSON.parse(msg.data)
   *   console.log('Order:', event)
   * }
   */
  durable(pattern: string, options: DurableSubscriptionOptions): Promise<DurableSubscription>

  /**
   * Resume a durable subscription via WebSocket
   * Connects to the subscription and receives events in real-time
   */
  resume(subscriptionId: string): Promise<WebSocket>

  /**
   * Pause a durable subscription
   * Stops event delivery but preserves the subscription
   */
  pause(subscriptionId: string): Promise<DurableSubscription>

  /**
   * Resume a paused subscription
   * Resumes event delivery for a paused subscription
   */
  resumeSubscription(subscriptionId: string): Promise<DurableSubscription>

  /**
   * Delete a durable subscription
   * Permanently removes the subscription
   */
  delete(subscriptionId: string): Promise<{ success: boolean }>

  /**
   * List all durable subscriptions
   */
  list(): Promise<DurableSubscription[]>

  /**
   * Unregister an event listener (in-memory)
   */
  off(listenerId: string): boolean

  /**
   * Unregister all listeners in a group (in-memory)
   */
  offGroup(group: string): number

  /**
   * Emit an event (for testing/internal use)
   * @returns Array of execution results for each handler
   */
  emit(event: BusinessEvent): Promise<ExecutionResult[]>

  /**
   * Clear all listeners (in-memory)
   */
  clear(): void

  /**
   * Semantic event builders for common patterns
   */
  zapier: {
    /**
     * Listen to Zapier trigger events
     * @example $.on.zapier.trigger('gmail', 'New Email', handler)
     */
    trigger(app: string, trigger: string, handler: EventHandler, options?: EventListenerOptions): string

    /**
     * Listen to Zapier action events
     * @example $.on.zapier.action('slack', 'Send Channel Message', handler)
     */
    action(app: string, action: string, handler: EventHandler, options?: EventListenerOptions): string
  }

  naics: {
    /**
     * Listen to events from specific NAICS sector
     * @example $.on.naics.sector('52', handler) // Finance and Insurance
     */
    sector(code: string, handler: EventHandler, options?: EventListenerOptions): string
  }

  onet: {
    /**
     * Listen to events from specific occupation
     * @example $.on.onet.occupation('15-1252.00', handler) // Software Developers
     */
    occupation(code: string, handler: EventHandler, options?: EventListenerOptions): string
  }
}

/**
 * Create OnService implementation
 *
 * IMPORTANT: For Cloudflare Workers or other multi-tenant environments,
 * create a new OnService instance per request to ensure isolation:
 *
 * @example
 * // In a Cloudflare Worker or request handler:
 * export default {
 *   async fetch(request: Request, env: Env, ctx: ExecutionContext) {
 *     const onService = createOnService() // New instance per request
 *     // ... use onService for this request only
 *   }
 * }
 *
 * @param config Optional registry configuration (limits, timeouts, etc.)
 * @param registry Optional registry instance. If not provided, creates a new isolated registry.
 */
export function createOnService(config?: RegistryConfig, registry?: EventListenerRegistry): OnService {
  const eventRegistry = registry || new EventListenerRegistry(config)
  const onService = ((pattern: EventPattern, handler: EventHandler, options?: EventListenerOptions) => {
    return eventRegistry.register(pattern, handler, options || {})
  }) as OnService

  onService.off = (listenerId: string) => eventRegistry.unregister(listenerId)
  onService.offGroup = (group: string) => eventRegistry.unregisterGroup(group)
  onService.emit = (event: BusinessEvent) => eventRegistry.execute(event)
  onService.clear = () => eventRegistry.clear()

  // Zapier integration
  onService.zapier = {
    trigger: (app: string, trigger: string, handler: EventHandler, options: EventListenerOptions = {}) => {
      return eventRegistry.register(
        (event: BusinessEvent) => {
          return event.metadata?.source === 'zapier' && event.metadata?.app === app && event.metadata?.trigger === trigger
        },
        handler,
        options
      )
    },
    action: (app: string, action: string, handler: EventHandler, options: EventListenerOptions = {}) => {
      return eventRegistry.register(
        (event: BusinessEvent) => {
          return event.metadata?.source === 'zapier' && event.metadata?.app === app && event.metadata?.action === action
        },
        handler,
        options
      )
    },
  }

  // NAICS integration - with type safety
  onService.naics = {
    sector: (code: string, handler: EventHandler, options: EventListenerOptions = {}) => {
      return eventRegistry.register(
        (event: BusinessEvent) => {
          const naics = event.metadata?.naics
          return typeof naics === 'string' && naics.startsWith(code)
        },
        handler,
        options
      )
    },
  }

  // O*NET integration - with type safety
  onService.onet = {
    occupation: (code: string, handler: EventHandler, options: EventListenerOptions = {}) => {
      return eventRegistry.register(
        (event: BusinessEvent) => {
          const metadataCode = getStringProperty(event.metadata, 'onetCode')
          const whoCode = getStringProperty(event.who, 'onetCode')
          return metadataCode === code || whoCode === code
        },
        handler,
        options
      )
    },
  }

  // Durable subscriptions (production-ready, queue-backed)
  // These require a workflows.do API endpoint to be configured
  const WORKFLOWS_API_URL = typeof process !== 'undefined' ? process.env.WORKFLOWS_API_URL : undefined
  const API_URL = WORKFLOWS_API_URL || 'https://workflows.do.co'

  onService.durable = async (pattern: string, options: DurableSubscriptionOptions): Promise<DurableSubscription> => {
    const response = await fetch(`${API_URL}/subscriptions/create`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        pattern,
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create durable subscription: ${response.statusText}`)
    }

    return response.json()
  }

  onService.resume = async (subscriptionId: string): Promise<WebSocket> => {
    // Determine WebSocket protocol (ws or wss based on API URL)
    const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws'
    const wsUrl = API_URL.replace(/^https?/, wsProtocol)

    const ws = new WebSocket(`${wsUrl}/subscriptions/connect?subscriptionId=${subscriptionId}`)

    return new Promise((resolve, reject) => {
      ws.onopen = () => resolve(ws)
      ws.onerror = (error) => reject(error)
    })
  }

  onService.pause = async (subscriptionId: string): Promise<DurableSubscription> => {
    const response = await fetch(`${API_URL}/subscriptions/pause?id=${subscriptionId}`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`Failed to pause subscription: ${response.statusText}`)
    }

    return response.json()
  }

  onService.resumeSubscription = async (subscriptionId: string): Promise<DurableSubscription> => {
    const response = await fetch(`${API_URL}/subscriptions/resume?id=${subscriptionId}`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`Failed to resume subscription: ${response.statusText}`)
    }

    return response.json()
  }

  onService.delete = async (subscriptionId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_URL}/subscriptions/delete?id=${subscriptionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete subscription: ${response.statusText}`)
    }

    return response.json()
  }

  onService.list = async (): Promise<DurableSubscription[]> => {
    const response = await fetch(`${API_URL}/subscriptions`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to list subscriptions: ${response.statusText}`)
    }

    const data = await response.json<{ subscriptions: DurableSubscription[] }>()
    return data.subscriptions
  }

  return onService
}

/**
 * Default OnService instance
 *
 * NOTE: This creates a new isolated registry by default.
 * In multi-tenant environments (Cloudflare Workers), each request
 * should create its own instance using createOnService().
 *
 * For simple applications or testing, this default instance is fine.
 */
export const on = createOnService()
