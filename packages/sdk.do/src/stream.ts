/**
 * Streaming Service for SDK.do
 *
 * Provides methods for real-time data streams using Server-Sent Events (SSE).
 * Supports event streaming, live search, batch monitoring, and health updates.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Stream real-time events
 * const stream = $.stream.events({
 *   types: ['$.Order.created', '$.Order.updated'],
 *   onEvent: (event) => console.log('New event:', event),
 *   onError: (error) => console.error('Error:', error)
 * })
 *
 * // Stop streaming
 * stream.close()
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface StreamEvent {
  id?: string
  event: string
  data: any
  timestamp?: string
}

export interface EventStreamOptions {
  /**
   * Filter by event types
   */
  types?: string[]

  /**
   * Filter by collections
   */
  collections?: string[]

  /**
   * Only events after this timestamp
   */
  since?: string

  /**
   * Poll interval in milliseconds
   * @default 1000
   */
  interval?: number

  /**
   * Callback for each event
   */
  onEvent?: (event: any) => void

  /**
   * Callback for connection opened
   */
  onConnected?: () => void

  /**
   * Callback for stream closed
   */
  onClosed?: (data: any) => void

  /**
   * Callback for errors
   */
  onError?: (error: Error) => void
}

export interface SearchStreamOptions {
  /**
   * Search query
   */
  query: string

  /**
   * Filter by collections
   */
  collections?: string[]

  /**
   * Poll interval in milliseconds
   * @default 5000
   */
  interval?: number

  /**
   * Callback for new results
   */
  onResults?: (results: any[]) => void

  /**
   * Callback for connection opened
   */
  onConnected?: () => void

  /**
   * Callback for stream closed
   */
  onClosed?: (data: any) => void

  /**
   * Callback for errors
   */
  onError?: (error: Error) => void
}

export interface BatchStreamOptions {
  /**
   * Batch ID to monitor
   */
  batchId: string

  /**
   * Poll interval in milliseconds
   * @default 500
   */
  interval?: number

  /**
   * Callback for progress updates
   */
  onProgress?: (progress: any) => void

  /**
   * Callback for completion
   */
  onComplete?: (data: any) => void

  /**
   * Callback for connection opened
   */
  onConnected?: () => void

  /**
   * Callback for errors
   */
  onError?: (error: Error) => void
}

export interface HealthStreamOptions {
  /**
   * Callback for health updates
   */
  onHealth?: (health: any) => void

  /**
   * Callback for connection opened
   */
  onConnected?: () => void

  /**
   * Callback for errors
   */
  onError?: (error: Error) => void
}

export interface StreamConnection {
  /**
   * Close the stream
   */
  close: () => void

  /**
   * Get the underlying EventSource
   */
  getEventSource: () => EventSource | null
}

export interface StreamCapabilities {
  capabilities: {
    protocol: string
    supportedStreams: string[]
    heartbeatInterval: string
    features: string[]
  }
  streams: Record<
    string,
    {
      path: string
      description: string
      params: Record<string, string>
    }
  >
  usage: {
    javascript: string
  }
}

// ============================================================================
// STREAM SERVICE
// ============================================================================

export class StreamService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://api.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params: Record<string, any> = {}): string {
    const url = new URL(`${this.baseUrl}${path}`)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)))
        } else {
          url.searchParams.set(key, String(value))
        }
      }
    })

    // Add API key if available
    if (this.apiKey) {
      url.searchParams.set('apiKey', this.apiKey)
    }

    return url.toString()
  }

  /**
   * Create EventSource connection with callbacks
   */
  private createEventSource(url: string, handlers: Record<string, (e: MessageEvent) => void>): StreamConnection {
    if (typeof EventSource === 'undefined') {
      throw new Error('EventSource is not available in this environment. SSE requires browser or Node.js with polyfill.')
    }

    const eventSource = new EventSource(url)

    // Register event handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      eventSource.addEventListener(event, handler)
    })

    return {
      close: () => eventSource.close(),
      getEventSource: () => eventSource,
    }
  }

  /**
   * Stream real-time events
   *
   * @param options - Event stream options
   * @returns StreamConnection for managing the stream
   *
   * @example
   * ```typescript
   * const stream = $.stream.events({
   *   types: ['$.Order.created'],
   *   onEvent: (event) => {
   *     console.log('Order created:', event)
   *   },
   *   onError: (error) => {
   *     console.error('Stream error:', error)
   *   }
   * })
   *
   * // Later, close the stream
   * stream.close()
   * ```
   */
  events(options: EventStreamOptions): StreamConnection {
    const url = this.buildUrl('/v1/stream/events', {
      types: options.types,
      collections: options.collections,
      since: options.since,
      interval: options.interval,
    })

    return this.createEventSource(url, {
      connected: (e) => {
        if (options.onConnected) {
          options.onConnected()
        }
      },
      event: (e) => {
        if (options.onEvent) {
          try {
            const data = JSON.parse(e.data)
            options.onEvent(data)
          } catch (error) {
            if (options.onError) {
              options.onError(error instanceof Error ? error : new Error('Failed to parse event data'))
            }
          }
        }
      },
      closed: (e) => {
        if (options.onClosed) {
          try {
            const data = JSON.parse(e.data)
            options.onClosed(data)
          } catch (error) {
            options.onClosed({ message: 'Stream closed' })
          }
        }
      },
      error: (e) => {
        if (options.onError) {
          options.onError(new Error('Event stream error'))
        }
      },
    })
  }

  /**
   * Stream live search results
   *
   * @param options - Search stream options
   * @returns StreamConnection for managing the stream
   *
   * @example
   * ```typescript
   * const stream = $.stream.search({
   *   query: 'order',
   *   collections: ['events'],
   *   onResults: (results) => {
   *     console.log('New results:', results)
   *   }
   * })
   * ```
   */
  search(options: SearchStreamOptions): StreamConnection {
    const url = this.buildUrl('/v1/stream/search', {
      q: options.query,
      collections: options.collections,
      interval: options.interval,
    })

    return this.createEventSource(url, {
      connected: (e) => {
        if (options.onConnected) {
          options.onConnected()
        }
      },
      results: (e) => {
        if (options.onResults) {
          try {
            const data = JSON.parse(e.data)
            options.onResults(data.new || [])
          } catch (error) {
            if (options.onError) {
              options.onError(error instanceof Error ? error : new Error('Failed to parse results'))
            }
          }
        }
      },
      closed: (e) => {
        if (options.onClosed) {
          try {
            const data = JSON.parse(e.data)
            options.onClosed(data)
          } catch (error) {
            options.onClosed({ message: 'Stream closed' })
          }
        }
      },
      error: (e) => {
        if (options.onError) {
          options.onError(new Error('Search stream error'))
        }
      },
    })
  }

  /**
   * Stream batch execution progress
   *
   * @param options - Batch stream options
   * @returns StreamConnection for managing the stream
   *
   * @example
   * ```typescript
   * const stream = $.stream.batch({
   *   batchId: 'batch_123',
   *   onProgress: (progress) => {
   *     console.log(`Completed: ${progress.completed}`)
   *   },
   *   onComplete: (data) => {
   *     console.log('Batch complete:', data)
   *   }
   * })
   * ```
   */
  batch(options: BatchStreamOptions): StreamConnection {
    const url = this.buildUrl(`/v1/stream/batch/${options.batchId}`, {
      interval: options.interval,
    })

    return this.createEventSource(url, {
      connected: (e) => {
        if (options.onConnected) {
          options.onConnected()
        }
      },
      progress: (e) => {
        if (options.onProgress) {
          try {
            const data = JSON.parse(e.data)
            options.onProgress(data)
          } catch (error) {
            if (options.onError) {
              options.onError(error instanceof Error ? error : new Error('Failed to parse progress'))
            }
          }
        }
      },
      complete: (e) => {
        if (options.onComplete) {
          try {
            const data = JSON.parse(e.data)
            options.onComplete(data)
          } catch (error) {
            if (options.onError) {
              options.onError(error instanceof Error ? error : new Error('Failed to parse completion'))
            }
          }
        }
      },
      error: (e) => {
        if (options.onError) {
          options.onError(new Error('Batch stream error'))
        }
      },
    })
  }

  /**
   * Stream system health updates
   *
   * @param options - Health stream options
   * @returns StreamConnection for managing the stream
   *
   * @example
   * ```typescript
   * const stream = $.stream.health({
   *   onHealth: (health) => {
   *     console.log('Health status:', health.status)
   *   }
   * })
   * ```
   */
  health(options: HealthStreamOptions = {}): StreamConnection {
    const url = this.buildUrl('/v1/stream/health', {})

    return this.createEventSource(url, {
      connected: (e) => {
        if (options.onConnected) {
          options.onConnected()
        }
      },
      health: (e) => {
        if (options.onHealth) {
          try {
            const data = JSON.parse(e.data)
            options.onHealth(data)
          } catch (error) {
            if (options.onError) {
              options.onError(error instanceof Error ? error : new Error('Failed to parse health data'))
            }
          }
        }
      },
      error: (e) => {
        if (options.onError) {
          options.onError(new Error('Health stream error'))
        }
      },
    })
  }

  /**
   * Get streaming API capabilities
   *
   * @returns Stream capabilities information
   *
   * @example
   * ```typescript
   * const capabilities = await $.stream.getCapabilities()
   * console.log(capabilities.streams) // Available stream endpoints
   * ```
   */
  async getCapabilities(): Promise<StreamCapabilities> {
    const response = await fetch(`${this.baseUrl}/v1/stream`, {
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get stream capabilities: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Helper method to create a simple event listener
   *
   * @param eventType - Event type to listen for
   * @param callback - Callback for each event
   * @returns StreamConnection
   *
   * @example
   * ```typescript
   * const stream = $.stream.listen('$.Order.created', (event) => {
   *   console.log('New order:', event)
   * })
   * ```
   */
  listen(eventType: string, callback: (event: any) => void): StreamConnection {
    return this.events({
      types: [eventType],
      onEvent: callback,
    })
  }

  /**
   * Helper method to watch search results in real-time
   *
   * @param query - Search query to watch
   * @param callback - Callback for new results
   * @returns StreamConnection
   *
   * @example
   * ```typescript
   * const stream = $.stream.watch('important orders', (results) => {
   *   console.log('New matching results:', results)
   * })
   * ```
   */
  watch(query: string, callback: (results: any[]) => void): StreamConnection {
    return this.search({
      query,
      onResults: callback,
    })
  }
}

/**
 * Create stream service instance
 */
export function createStreamService(baseUrl?: string, apiKey?: string): StreamService {
  return new StreamService(baseUrl, apiKey)
}

/**
 * Default stream service instance
 */
export const stream = createStreamService()
