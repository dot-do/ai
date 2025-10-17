/**
 * Queue Service for SDK.do
 *
 * Provides message queue operations for async processing via Cloudflare Queues.
 * Integrates with workers/queue for reliable message delivery and background jobs.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Publish a single message
 * await $.queue.publish('tasks', {
 *   type: 'send-email',
 *   to: 'user@example.com',
 *   subject: 'Welcome!'
 * })
 *
 * // Publish batch
 * await $.queue.batch('events', [
 *   { type: 'user.created', userId: '123' },
 *   { type: 'user.updated', userId: '456' }
 * ])
 *
 * // Get queue stats
 * const stats = await $.queue.stats('tasks')
 * console.log('Pending:', stats.pending)
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export type QueueName = 'events' | 'tasks' | 'webhooks' | 'emails' | 'analytics'

export interface PublishOptions {
  /**
   * Message delay in seconds
   */
  delaySeconds?: number

  /**
   * Message content type
   */
  contentType?: string
}

export interface PublishResponse {
  /**
   * Message ID
   */
  messageId: string

  /**
   * Queue name
   */
  queue: QueueName

  /**
   * Published timestamp
   */
  publishedAt: string
}

export interface BatchPublishResponse {
  /**
   * Successfully published message IDs
   */
  messageIds: string[]

  /**
   * Success count
   */
  successCount: number

  /**
   * Failed count
   */
  failedCount: number

  /**
   * Failed messages (if any)
   */
  failures?: Array<{
    message: any
    error: string
  }>
}

export interface QueueStats {
  /**
   * Queue name
   */
  queue: QueueName

  /**
   * Pending messages
   */
  pending: number

  /**
   * In-flight messages
   */
  inFlight: number

  /**
   * Dead letter queue count
   */
  deadLetterCount: number

  /**
   * Messages per second (rate)
   */
  messagesPerSecond: number

  /**
   * Average processing time (ms)
   */
  avgProcessingTime?: number
}

export interface HealthStatus {
  /**
   * Overall health status
   */
  healthy: boolean

  /**
   * Per-queue health
   */
  queues: Record<
    QueueName,
    {
      healthy: boolean
      pending: number
      errors: number
    }
  >

  /**
   * Timestamp
   */
  timestamp: string
}

// ============================================================================
// QUEUE SERVICE
// ============================================================================

export class QueueService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://queue.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Publish a message to a queue
   *
   * @param queue - Queue name
   * @param message - Message payload
   * @param options - Publish options
   * @returns Publish response with message ID
   *
   * @example
   * ```typescript
   * // Simple message
   * await $.queue.publish('tasks', {
   *   type: 'process-order',
   *   orderId: '12345'
   * })
   *
   * // With delay
   * await $.queue.publish('emails', {
   *   type: 'send-reminder',
   *   userId: '123'
   * }, {
   *   delaySeconds: 3600 // Send in 1 hour
   * })
   * ```
   */
  async publish(queue: QueueName, message: any, options: PublishOptions = {}): Promise<PublishResponse> {
    const response = await fetch(`${this.baseUrl}/publish`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        queue,
        message,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to publish message: ${error}`)
    }

    return response.json()
  }

  /**
   * Publish multiple messages in batch
   *
   * @param queue - Queue name
   * @param messages - Array of message payloads
   * @param options - Publish options (applied to all messages)
   * @returns Batch publish response
   *
   * @example
   * ```typescript
   * const result = await $.queue.batch('events', [
   *   { type: 'user.created', userId: '1' },
   *   { type: 'user.created', userId: '2' },
   *   { type: 'user.created', userId: '3' }
   * ])
   *
   * console.log(`Published ${result.successCount} messages`)
   * if (result.failedCount > 0) {
   *   console.error('Failures:', result.failures)
   * }
   * ```
   */
  async batch(queue: QueueName, messages: any[], options: PublishOptions = {}): Promise<BatchPublishResponse> {
    const response = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        queue,
        messages,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to batch publish: ${error}`)
    }

    return response.json()
  }

  /**
   * Get queue statistics
   *
   * @param queue - Queue name (optional, returns all if not specified)
   * @returns Queue statistics
   *
   * @example
   * ```typescript
   * // Get stats for specific queue
   * const stats = await $.queue.stats('tasks')
   * console.log('Pending messages:', stats.pending)
   * console.log('Processing rate:', stats.messagesPerSecond, 'msg/s')
   *
   * // Get stats for all queues
   * const allStats = await $.queue.stats()
   * Object.entries(allStats).forEach(([name, stats]) => {
   *   console.log(`${name}: ${stats.pending} pending`)
   * })
   * ```
   */
  async stats(queue?: QueueName): Promise<QueueStats | Record<QueueName, QueueStats>> {
    const url = queue ? `${this.baseUrl}/stats/${queue}` : `${this.baseUrl}/stats`

    const response = await fetch(url, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get queue stats: ${error}`)
    }

    return response.json()
  }

  /**
   * Get queue health status
   *
   * @returns Health status for all queues
   *
   * @example
   * ```typescript
   * const health = await $.queue.health()
   * if (health.healthy) {
   *   console.log('All queues healthy')
   * } else {
   *   Object.entries(health.queues).forEach(([name, status]) => {
   *     if (!status.healthy) {
   *       console.warn(`Queue ${name} unhealthy:`, status)
   *     }
   *   })
   * }
   * ```
   */
  async health(): Promise<HealthStatus> {
    const response = await fetch(`${this.baseUrl}/health`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get queue health: ${error}`)
    }

    return response.json()
  }
}

/**
 * Create queue service instance
 */
export function createQueueService(baseUrl?: string, apiKey?: string): QueueService {
  return new QueueService(baseUrl, apiKey)
}

/**
 * Default queue service instance
 */
export const queue = createQueueService()
