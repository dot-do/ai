/**
 * Events Service for .do SDK
 *
 * Provides unified event publishing, subscription, streaming, and management.
 * Integrates with existing `send` and `on` services but provides a comprehensive
 * events API with semantic patterns from graphdl.
 *
 * Features:
 * - Event publishing with semantic patterns ($.Subject.verb.Object)
 * - Event subscription and listeners
 * - Event streams (real-time, replay, catch-up)
 * - Event history and querying
 * - Dead letter queue management
 * - Event filtering and routing
 * - Batch event publishing
 * - Event validation and schema enforcement
 * - Metrics and monitoring
 *
 * @example
 * ```typescript
 * import { $, events } from 'sdk.do'
 *
 * // Publish events
 * await events.publish('user.created', { userId: '123', email: 'alice@example.com' })
 * await events.publish($.User.created, { userId: '123' })
 *
 * // Subscribe to events
 * events.subscribe('user.created', async (event) => {
 *   console.log('User created:', event.payload)
 * })
 *
 * // Event streams
 * const stream = await events.stream('orders.*', {
 *   from: 'beginning',
 *   filter: { status: 'pending' }
 * })
 * for await (const event of stream) {
 *   console.log(event)
 * }
 *
 * // Query event history
 * const history = await events.history('user.*', {
 *   from: '2025-01-01',
 *   to: '2025-01-31',
 *   limit: 100
 * })
 *
 * // Batch publishing
 * await events.batchPublish([
 *   { type: 'user.created', payload: {...} },
 *   { type: 'user.updated', payload: {...} }
 * ])
 * ```
 */

import type { BusinessEvent } from './on'

/**
 * Event types supported by the events service
 */
export type EventType = string

/**
 * Event payload (any valid JSON value)
 */
export type EventPayload = any

/**
 * Event structure
 */
export interface Event<TPayload = EventPayload> {
  /**
   * Event ID (unique)
   */
  id: string

  /**
   * Event type (e.g., 'user.created', 'order.shipped')
   */
  type: EventType

  /**
   * Event payload
   */
  payload: TPayload

  /**
   * Event metadata
   */
  metadata?: Record<string, any>

  /**
   * Timestamp (ISO 8601)
   */
  timestamp: string

  /**
   * Event source
   */
  source?: string

  /**
   * Event version
   */
  version?: string
}

/**
 * Event subscriber callback
 */
export type EventSubscriber<TPayload = EventPayload> = (event: Event<TPayload>) => void | Promise<void>

/**
 * Subscription options
 */
export interface SubscribeOptions {
  /**
   * Subscription ID (if resuming)
   */
  id?: string

  /**
   * Event filter
   */
  filter?: Record<string, any>

  /**
   * Start from position
   * - 'beginning': Start from the first event
   * - 'now': Start from current time
   * - timestamp: Start from specific time
   */
  from?: 'beginning' | 'now' | string

  /**
   * Durable subscription (persists across restarts)
   */
  durable?: boolean

  /**
   * Consumer group (for load balancing)
   */
  group?: string

  /**
   * Max concurrent messages
   */
  maxConcurrent?: number
}

/**
 * Subscription information
 */
export interface Subscription {
  /**
   * Subscription ID
   */
  id: string

  /**
   * Event pattern
   */
  pattern: EventType

  /**
   * Subscription status
   */
  status: 'active' | 'paused' | 'cancelled'

  /**
   * Created at
   */
  createdAt: string

  /**
   * Consumer group
   */
  group?: string

  /**
   * Durable
   */
  durable: boolean
}

/**
 * Stream options
 */
export interface StreamOptions {
  /**
   * Start position
   * - 'beginning': Start from the first event
   * - 'now': Start from current time
   * - timestamp: Start from specific time
   */
  from?: 'beginning' | 'now' | string

  /**
   * End position (optional)
   */
  to?: string

  /**
   * Event filter
   */
  filter?: Record<string, any>

  /**
   * Batch size for streaming
   */
  batchSize?: number

  /**
   * Stream timeout (milliseconds)
   */
  timeout?: number
}

/**
 * History query options
 */
export interface HistoryOptions {
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
   * Event filter
   */
  filter?: Record<string, any>

  /**
   * Sort order
   */
  order?: 'asc' | 'desc'
}

/**
 * Batch event for publishing
 */
export interface BatchEvent {
  /**
   * Event type
   */
  type: EventType

  /**
   * Event payload
   */
  payload: EventPayload

  /**
   * Event metadata
   */
  metadata?: Record<string, any>
}

/**
 * Batch publish result
 */
export interface BatchPublishResult {
  /**
   * Number of events published successfully
   */
  success: number

  /**
   * Number of events that failed
   */
  failed: number

  /**
   * Event IDs (for successful events)
   */
  eventIds: string[]

  /**
   * Errors (for failed events)
   */
  errors?: Array<{
    index: number
    error: string
  }>
}

/**
 * Dead letter queue entry
 */
export interface DLQEntry {
  /**
   * Entry ID
   */
  id: string

  /**
   * Original event
   */
  event: Event

  /**
   * Error message
   */
  error: string

  /**
   * Retry count
   */
  retryCount: number

  /**
   * Created at
   */
  createdAt: string

  /**
   * Last retry at
   */
  lastRetryAt?: string
}

/**
 * Event metrics
 */
export interface EventMetrics {
  /**
   * Total events published
   */
  published: number

  /**
   * Total events consumed
   */
  consumed: number

  /**
   * Events per second (last minute)
   */
  rate: number

  /**
   * Average latency (milliseconds)
   */
  latency: number

  /**
   * Error rate (0-1)
   */
  errorRate: number

  /**
   * Top event types
   */
  topTypes: Array<{
    type: string
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
 * Metrics query options
 */
export interface MetricsOptions {
  /**
   * Start time (ISO 8601)
   */
  from?: string

  /**
   * End time (ISO 8601)
   */
  to?: string

  /**
   * Granularity (minutes)
   */
  granularity?: number
}

/**
 * Events service configuration
 */
export interface EventsServiceConfig {
  /**
   * Events API URL
   * @default process.env.EVENTS_API_URL || 'https://events.do'
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
 * Events service class
 */
export class EventsService {
  private config: Required<Omit<EventsServiceConfig, 'apiKey'>> & { apiKey?: string }
  private activeSubscriptions = new Map<string, () => void>()

  constructor(config: EventsServiceConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || process.env.EVENTS_API_URL || 'https://events.do',
      telemetry: config.telemetry !== false,
      apiKey: config.apiKey || process.env.DO_TOKEN,
    }
  }

  /**
   * Publish an event
   *
   * @example
   * ```typescript
   * await events.publish('user.created', {
   *   userId: '123',
   *   email: 'alice@example.com'
   * })
   * ```
   */
  async publish<TPayload = EventPayload>(type: EventType, payload: TPayload, metadata?: Record<string, any>): Promise<Event<TPayload>> {
    const response = await fetch(`${this.config.apiUrl}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        type,
        payload,
        metadata,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to publish event: ${response.status} ${error}`)
    }

    const result = await response.json()

    if (this.config.telemetry) {
      console.log(`[events] Published ${type}`, { eventId: result.id })
    }

    return result as Event<TPayload>
  }

  /**
   * Batch publish multiple events
   *
   * @example
   * ```typescript
   * await events.batchPublish([
   *   { type: 'user.created', payload: { userId: '123' } },
   *   { type: 'user.updated', payload: { userId: '456' } }
   * ])
   * ```
   */
  async batchPublish(events: BatchEvent[]): Promise<BatchPublishResult> {
    const response = await fetch(`${this.config.apiUrl}/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
      body: JSON.stringify({ events }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to batch publish events: ${response.status} ${error}`)
    }

    const result = await response.json()

    if (this.config.telemetry) {
      console.log(`[events] Batch published ${result.success} events (${result.failed} failed)`)
    }

    return result as BatchPublishResult
  }

  /**
   * Subscribe to events
   *
   * @example
   * ```typescript
   * const subscription = events.subscribe('user.*', async (event) => {
   *   console.log('User event:', event)
   * })
   *
   * // Unsubscribe later
   * subscription.unsubscribe()
   * ```
   */
  subscribe<TPayload = EventPayload>(
    pattern: EventType,
    handler: EventSubscriber<TPayload>,
    options: SubscribeOptions = {}
  ): { id: string; unsubscribe: () => void } {
    const subscriptionId = options.id || crypto.randomUUID()

    // Create WebSocket connection for real-time events
    const wsProtocol = this.config.apiUrl.startsWith('https') ? 'wss' : 'ws'
    const wsUrl = this.config.apiUrl.replace(/^https?/, wsProtocol)

    const params = new URLSearchParams({
      pattern,
      ...(options.from ? { from: options.from } : {}),
      ...(options.filter ? { filter: JSON.stringify(options.filter) } : {}),
      ...(options.durable ? { durable: 'true' } : {}),
      ...(options.group ? { group: options.group } : {}),
    })

    const ws = new WebSocket(`${wsUrl}/subscribe?${params}`)

    ws.onmessage = async (msg) => {
      try {
        const event = JSON.parse(msg.data) as Event<TPayload>
        await handler(event)
      } catch (error) {
        console.error(`[events] Error handling event:`, error)
      }
    }

    ws.onerror = (error) => {
      console.error(`[events] WebSocket error:`, error)
    }

    const unsubscribe = () => {
      ws.close()
      this.activeSubscriptions.delete(subscriptionId)
    }

    this.activeSubscriptions.set(subscriptionId, unsubscribe)

    if (this.config.telemetry) {
      console.log(`[events] Subscribed to ${pattern}`, { subscriptionId })
    }

    return {
      id: subscriptionId,
      unsubscribe,
    }
  }

  /**
   * Create an event stream
   *
   * @example
   * ```typescript
   * const stream = await events.stream('orders.*', {
   *   from: 'beginning',
   *   filter: { status: 'pending' }
   * })
   *
   * for await (const event of stream) {
   *   console.log('Order event:', event)
   * }
   * ```
   */
  async stream<TPayload = EventPayload>(pattern: EventType, options: StreamOptions = {}): Promise<AsyncIterable<Event<TPayload>>> {
    const params = new URLSearchParams({
      pattern,
      ...(options.from ? { from: options.from } : {}),
      ...(options.to ? { to: options.to } : {}),
      ...(options.filter ? { filter: JSON.stringify(options.filter) } : {}),
      ...(options.batchSize ? { batchSize: options.batchSize.toString() } : {}),
    })

    const response = await fetch(`${this.config.apiUrl}/stream?${params}`, {
      method: 'GET',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create event stream: ${response.status} ${error}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    if (this.config.telemetry) {
      console.log(`[events] Created stream for ${pattern}`)
    }

    return {
      [Symbol.asyncIterator](): AsyncIterator<Event<TPayload>> {
        return {
          async next(): Promise<IteratorResult<Event<TPayload>>> {
            while (true) {
              const { done, value } = await reader.read()

              if (done) {
                return { done: true, value: undefined }
              }

              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\n')
              buffer = lines.pop() || ''

              for (const line of lines) {
                if (!line.trim() || !line.startsWith('data: ')) continue

                const data = line.slice(6)
                if (data === '[DONE]') {
                  return { done: true, value: undefined }
                }

                try {
                  const event = JSON.parse(data) as Event<TPayload>
                  return { done: false, value: event }
                } catch (error) {
                  console.error('[events] Failed to parse event:', error)
                }
              }
            }
          },
        }
      },
    }
  }

  /**
   * Query event history
   *
   * @example
   * ```typescript
   * const history = await events.history('user.*', {
   *   from: '2025-01-01',
   *   to: '2025-01-31',
   *   limit: 100
   * })
   * ```
   */
  async history<TPayload = EventPayload>(pattern: EventType, options: HistoryOptions = {}): Promise<Event<TPayload>[]> {
    const params = new URLSearchParams({
      pattern,
      ...(options.from ? { from: options.from } : {}),
      ...(options.to ? { to: options.to } : {}),
      ...(options.limit ? { limit: options.limit.toString() } : {}),
      ...(options.offset ? { offset: options.offset.toString() } : {}),
      ...(options.filter ? { filter: JSON.stringify(options.filter) } : {}),
      ...(options.order ? { order: options.order } : {}),
    })

    const response = await fetch(`${this.config.apiUrl}/history?${params}`, {
      method: 'GET',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to query event history: ${response.status} ${error}`)
    }

    const result = await response.json()

    if (this.config.telemetry) {
      console.log(`[events] Queried history for ${pattern}`, { count: result.events?.length || 0 })
    }

    return result.events || []
  }

  /**
   * Get dead letter queue entries
   *
   * @example
   * ```typescript
   * const dlq = await events.dlq('failed-events')
   * for (const entry of dlq) {
   *   console.log('Failed event:', entry.event, entry.error)
   * }
   * ```
   */
  async dlq(queue: string = 'default'): Promise<DLQEntry[]> {
    const response = await fetch(`${this.config.apiUrl}/dlq/${queue}`, {
      method: 'GET',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get DLQ entries: ${response.status} ${error}`)
    }

    const result = await response.json()
    return result.entries || []
  }

  /**
   * Retry a failed event from DLQ
   *
   * @example
   * ```typescript
   * await events.retry('dlq-entry-123')
   * ```
   */
  async retry(entryId: string): Promise<void> {
    const response = await fetch(`${this.config.apiUrl}/dlq/${entryId}/retry`, {
      method: 'POST',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to retry DLQ entry: ${response.status} ${error}`)
    }

    if (this.config.telemetry) {
      console.log(`[events] Retried DLQ entry ${entryId}`)
    }
  }

  /**
   * Discard a failed event from DLQ
   *
   * @example
   * ```typescript
   * await events.discard('dlq-entry-123')
   * ```
   */
  async discard(entryId: string): Promise<void> {
    const response = await fetch(`${this.config.apiUrl}/dlq/${entryId}`, {
      method: 'DELETE',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to discard DLQ entry: ${response.status} ${error}`)
    }

    if (this.config.telemetry) {
      console.log(`[events] Discarded DLQ entry ${entryId}`)
    }
  }

  /**
   * Get event metrics
   *
   * @example
   * ```typescript
   * const metrics = await events.metrics('user.*', {
   *   from: '2025-01-01',
   *   to: '2025-01-31'
   * })
   * console.log('Published:', metrics.published)
   * console.log('Consumed:', metrics.consumed)
   * ```
   */
  async metrics(pattern: EventType, options: MetricsOptions = {}): Promise<EventMetrics> {
    const params = new URLSearchParams({
      pattern,
      ...(options.from ? { from: options.from } : {}),
      ...(options.to ? { to: options.to } : {}),
      ...(options.granularity ? { granularity: options.granularity.toString() } : {}),
    })

    const response = await fetch(`${this.config.apiUrl}/metrics?${params}`, {
      method: 'GET',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get event metrics: ${response.status} ${error}`)
    }

    const result = await response.json()
    return result as EventMetrics
  }

  /**
   * List all subscriptions
   *
   * @example
   * ```typescript
   * const subscriptions = await events.listSubscriptions()
   * ```
   */
  async listSubscriptions(): Promise<Subscription[]> {
    const response = await fetch(`${this.config.apiUrl}/subscriptions`, {
      method: 'GET',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list subscriptions: ${response.status} ${error}`)
    }

    const result = await response.json()
    return result.subscriptions || []
  }

  /**
   * Get subscription details
   *
   * @example
   * ```typescript
   * const subscription = await events.getSubscription('sub-123')
   * ```
   */
  async getSubscription(id: string): Promise<Subscription> {
    const response = await fetch(`${this.config.apiUrl}/subscriptions/${id}`, {
      method: 'GET',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get subscription: ${response.status} ${error}`)
    }

    return (await response.json()) as Subscription
  }

  /**
   * Cancel a subscription
   *
   * @example
   * ```typescript
   * await events.cancelSubscription('sub-123')
   * ```
   */
  async cancelSubscription(id: string): Promise<void> {
    const response = await fetch(`${this.config.apiUrl}/subscriptions/${id}`, {
      method: 'DELETE',
      headers: {
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to cancel subscription: ${response.status} ${error}`)
    }

    this.activeSubscriptions.get(id)?.()
    this.activeSubscriptions.delete(id)

    if (this.config.telemetry) {
      console.log(`[events] Cancelled subscription ${id}`)
    }
  }

  /**
   * Cleanup all active subscriptions
   */
  cleanup(): void {
    for (const [id, unsubscribe] of this.activeSubscriptions) {
      unsubscribe()
    }
    this.activeSubscriptions.clear()
  }
}

/**
 * Create an EventsService instance
 *
 * @example
 * ```typescript
 * import { createEventsService } from 'sdk.do'
 *
 * const events = createEventsService({
 *   apiUrl: 'https://events.do',
 *   apiKey: process.env.DO_TOKEN
 * })
 *
 * await events.publish('user.created', { userId: '123' })
 * ```
 */
export function createEventsService(config?: EventsServiceConfig): EventsService {
  return new EventsService(config)
}

/**
 * Default EventsService instance
 */
export const events = createEventsService()
