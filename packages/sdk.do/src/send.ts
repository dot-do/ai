/**
 * Event Publishing System for .do SDK
 *
 * Supports semantic event patterns:
 * - $.send.Order.created({ orderId: '123', customerId: '456' })
 * - $.send.Customer.updated({ customerId: '456', changes: {...} })
 * - $.send.Payment.failed({ paymentId: '789', reason: 'insufficient-funds' })
 *
 * Events are published to Cloudflare Queues for reliable, asynchronous processing.
 * The events worker consumes these events and routes them to registered listeners.
 *
 * Integration:
 * - Cloudflare Queues for reliable delivery
 * - Events worker for routing and processing
 * - graphdl BusinessEvent format (5W1H pattern)
 * - Compatible with $.on() listeners
 */

import type { BusinessEvent } from './on'
import type { SendService } from './types'

/**
 * Event publisher options
 */
export interface SendOptions {
  /**
   * Queue name to publish to
   * @default 'events'
   */
  queue?: string

  /**
   * Priority (higher = processed first)
   * @default 0
   */
  priority?: number

  /**
   * Delay before processing (milliseconds)
   */
  delay?: number

  /**
   * Event metadata
   */
  metadata?: Record<string, any>

  /**
   * Actor (who) - Person, Organization, Agent, System
   */
  who?: any

  /**
   * Location (where)
   */
  where?: any

  /**
   * Purpose (why)
   */
  why?: any

  /**
   * Method (how)
   */
  how?: any
}

/**
 * Queue binding interface
 */
export interface QueueBinding {
  send(message: any, options?: { contentType?: string }): Promise<void>
  sendBatch(messages: any[]): Promise<void>
}

/**
 * Events service configuration
 */
export interface EventsServiceConfig {
  /**
   * Events API URL
   * @default process.env.EVENTS_API_URL || 'https://apis.do/v1/events'
   */
  apiUrl?: string

  /**
   * API key for authentication
   */
  apiKey?: string

  /**
   * Queue binding (if running in Cloudflare Worker)
   */
  queue?: QueueBinding

  /**
   * Default queue name
   * @default 'events'
   */
  defaultQueue?: string

  /**
   * Enable telemetry
   * @default true
   */
  telemetry?: boolean
}

/**
 * Event publisher result
 */
export interface SendResult {
  success: boolean
  eventId?: string
  error?: string
}

/**
 * Create a semantic event from Subject.predicate pattern
 */
function createBusinessEvent<TPayload = any>(subject: string, predicate: string, payload: TPayload, options: SendOptions = {}): BusinessEvent<TPayload> {
  return {
    who: options.who || {
      $type: 'System',
      $id: 'sdk',
    },
    what: {
      ...((payload as any) || {}),
      $type: subject,
      $id: (payload as any)?.$id || (payload as any)?.id,
    },
    when: new Date().toISOString(),
    where: options.where || {
      digital: {
        platform: 'sdk',
      },
    },
    why: options.why,
    how: options.how,
    metadata: {
      ...options.metadata,
      action: predicate,
      verb: predicate,
      queue: options.queue || 'events',
      priority: options.priority || 0,
    },
  }
}

/**
 * Event publisher class
 */
export class EventPublisher {
  private config: Required<Omit<EventsServiceConfig, 'queue' | 'apiKey'>> & {
    queue?: QueueBinding
    apiKey?: string
  }

  constructor(config: EventsServiceConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || process.env.EVENTS_API_URL || 'https://apis.do/v1/events',
      defaultQueue: config.defaultQueue || 'events',
      telemetry: config.telemetry !== false,
      queue: config.queue,
      apiKey: config.apiKey || process.env.DO_TOKEN,
    }
  }

  /**
   * Publish event to queue (if available) or API
   */
  async publish<TPayload = any>(subject: string, predicate: string, payload: TPayload, options: SendOptions = {}): Promise<SendResult> {
    try {
      const event = createBusinessEvent(subject, predicate, payload, options)

      // Use queue if available (Cloudflare Worker environment)
      if (this.config.queue) {
        await this.config.queue.send(event, {
          contentType: 'application/json',
        })

        if (this.config.telemetry) {
          console.log(`[send] Published ${subject}.${predicate} to queue`, {
            subject,
            predicate,
            eventId: event.what.$id,
          })
        }

        return {
          success: true,
          eventId: event.what.$id,
        }
      }

      // Fallback to HTTP API
      const response = await fetch(`${this.config.apiUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          type: `${subject}.${predicate}`,
          data: event,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        return {
          success: false,
          error: `HTTP ${response.status}: ${error}`,
        }
      }

      const result = await response.json()

      if (this.config.telemetry) {
        console.log(`[send] Published ${subject}.${predicate} via API`, {
          subject,
          predicate,
          eventId: result.id,
        })
      }

      return {
        success: true,
        eventId: result.id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}

/**
 * Create SendService proxy with semantic event publishing
 *
 * @example
 * ```typescript
 * const send = createSendProxy()
 *
 * // Publish Order.created event
 * await send.Order.created({
 *   orderId: '123',
 *   customerId: '456',
 *   total: 99.99
 * })
 *
 * // Publish Payment.failed with metadata
 * await send.Payment.failed(
 *   { paymentId: '789', reason: 'insufficient-funds' },
 *   { priority: 10, who: { $type: 'Customer', $id: 'cust_456' } }
 * )
 * ```
 */
export function createSendProxy(config: EventsServiceConfig = {}): SendService {
  const publisher = new EventPublisher(config)

  return new Proxy({} as SendService, {
    get: (_target, subject: string) => {
      return new Proxy(
        {},
        {
          get: (_subTarget, predicate: string) => {
            return async <TPayload = unknown>(payload?: TPayload, options?: SendOptions): Promise<void> => {
              const result = await publisher.publish(subject, predicate, payload || ({} as TPayload), options || {})

              if (!result.success) {
                throw new Error(`Failed to send ${subject}.${predicate}: ${result.error}`)
              }
            }
          },
        }
      )
    },
  })
}

/**
 * Default SendService instance
 *
 * NOTE: In Cloudflare Workers, create a new instance per request with queue binding:
 * ```typescript
 * export default {
 *   async fetch(request: Request, env: Env) {
 *     const send = createSendProxy({ queue: env.EVENTS_QUEUE })
 *     await send.Order.created({ orderId: '123' })
 *   }
 * }
 * ```
 */
export const send = createSendProxy()
