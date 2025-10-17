/**
 * analytics.do SDK - Client Implementation
 */

import type {
  AnalyticsConfig,
  TrackEvent,
  PageEvent,
  IdentifyEvent,
  GroupEvent,
  AliasEvent,
  EventProperties,
  UserTraits,
  PageProperties,
  QueryOptions,
  AggregateOptions,
  CohortOptions,
  FunnelOptions,
  PaginatedResponse,
  AggregateResult,
  CohortResult,
  FunnelResult,
} from './types'
import {
  generateMessageId,
  getTimestamp,
  enrichContext,
  validateEventName,
  validateUserId,
  getAnonymousId,
  EventBatcher,
} from './utils'

export class AnalyticsClient {
  private writeKey?: string
  private host: string
  private debug: boolean
  private timeout: number
  private headers: Record<string, string>
  private batcher?: EventBatcher<any>
  private anonymousId?: string

  constructor(config: AnalyticsConfig = {}) {
    this.writeKey = config.writeKey
    this.host = config.host || 'https://analytics.do'
    this.debug = config.debug || false
    this.timeout = config.timeout || 10000
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    if (this.writeKey) {
      if (this.writeKey.includes('\n') || this.writeKey.includes('\r')) {
        throw new Error('Invalid writeKey: contains newline characters')
      }
      this.headers['Authorization'] = `Bearer ${this.writeKey}`
    }

    // Initialize batcher if configured
    if (config.batchSize && config.batchSize > 1) {
      this.batcher = new EventBatcher(
        (events) => this.sendBatch(events),
        config.batchSize,
        config.batchInterval || 5000
      )
    }

    // Get or create anonymous ID (browser only)
    if (typeof window !== 'undefined') {
      this.anonymousId = getAnonymousId()
    }
  }

  /**
   * Track an event
   */
  async track(
    event: string,
    properties?: EventProperties,
    options?: { userId?: string; anonymousId?: string; context?: any }
  ): Promise<void> {
    validateEventName(event)

    const trackEvent: TrackEvent = {
      event,
      userId: options?.userId,
      anonymousId: options?.anonymousId || this.anonymousId,
      properties,
      context: enrichContext(options?.context),
      timestamp: getTimestamp(),
      messageId: generateMessageId(),
    }

    if (this.debug) {
      console.log('[analytics.do] track:', trackEvent)
    }

    if (this.batcher) {
      this.batcher.add({ type: 'track', ...trackEvent })
    } else {
      await this.send('/track', trackEvent)
    }
  }

  /**
   * Track a pageview
   */
  async page(
    name?: string,
    properties?: PageProperties,
    options?: { userId?: string; anonymousId?: string; context?: any }
  ): Promise<void> {
    const pageEvent: PageEvent = {
      name,
      userId: options?.userId,
      anonymousId: options?.anonymousId || this.anonymousId,
      properties,
      context: enrichContext(options?.context),
      timestamp: getTimestamp(),
      messageId: generateMessageId(),
    }

    if (this.debug) {
      console.log('[analytics.do] page:', pageEvent)
    }

    if (this.batcher) {
      this.batcher.add({ type: 'page', ...pageEvent })
    } else {
      await this.send('/page', pageEvent)
    }
  }

  /**
   * Identify a user
   */
  async identify(
    userId: string,
    traits?: UserTraits,
    options?: { anonymousId?: string; context?: any }
  ): Promise<void> {
    validateUserId(userId)

    const identifyEvent: IdentifyEvent = {
      userId,
      anonymousId: options?.anonymousId || this.anonymousId,
      traits,
      context: enrichContext(options?.context),
      timestamp: getTimestamp(),
      messageId: generateMessageId(),
    }

    if (this.debug) {
      console.log('[analytics.do] identify:', identifyEvent)
    }

    if (this.batcher) {
      this.batcher.add({ type: 'identify', ...identifyEvent })
    } else {
      await this.send('/identify', identifyEvent)
    }
  }

  /**
   * Group a user
   */
  async group(
    userId: string,
    groupId: string,
    traits?: Record<string, any>,
    options?: { context?: any }
  ): Promise<void> {
    validateUserId(userId)
    validateUserId(groupId)

    const groupEvent: GroupEvent = {
      userId,
      groupId,
      traits,
      context: enrichContext(options?.context),
      timestamp: getTimestamp(),
      messageId: generateMessageId(),
    }

    if (this.debug) {
      console.log('[analytics.do] group:', groupEvent)
    }

    if (this.batcher) {
      this.batcher.add({ type: 'group', ...groupEvent })
    } else {
      await this.send('/group', groupEvent)
    }
  }

  /**
   * Alias a user identity
   */
  async alias(userId: string, previousId: string, options?: { context?: any }): Promise<void> {
    validateUserId(userId)
    validateUserId(previousId)

    const aliasEvent: AliasEvent = {
      userId,
      previousId,
      context: enrichContext(options?.context),
      timestamp: getTimestamp(),
      messageId: generateMessageId(),
    }

    if (this.debug) {
      console.log('[analytics.do] alias:', aliasEvent)
    }

    if (this.batcher) {
      this.batcher.add({ type: 'alias', ...aliasEvent })
    } else {
      await this.send('/alias', aliasEvent)
    }
  }

  /**
   * Query events
   */
  async query<T = any>(options: QueryOptions = {}): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams()
    if (options.event) params.set('event', options.event)
    if (options.userId) params.set('userId', options.userId)
    if (options.from) params.set('from', options.from)
    if (options.to) params.set('to', options.to)
    if (options.limit) params.set('limit', String(options.limit))
    if (options.offset) params.set('offset', String(options.offset))
    if (options.sort) params.set('sort', JSON.stringify(options.sort))
    if (options.filter) params.set('filter', JSON.stringify(options.filter))

    return this.fetch(`/query?${params}`)
  }

  /**
   * Aggregate metrics
   */
  async aggregate(options: AggregateOptions): Promise<AggregateResult> {
    return this.fetch('/aggregate', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Cohort analysis
   */
  async cohort(options: CohortOptions): Promise<CohortResult> {
    return this.fetch('/cohort', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Funnel metrics
   */
  async funnel(options: FunnelOptions): Promise<FunnelResult> {
    return this.fetch('/funnel', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Flush batched events
   */
  async flush(): Promise<void> {
    if (this.batcher) {
      await this.batcher.flush()
    }
  }

  /**
   * Send a single event
   */
  private async send(path: string, data: any): Promise<void> {
    await this.fetch(path, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Send a batch of events
   */
  private async sendBatch(events: any[]): Promise<void> {
    await this.fetch('/batch', {
      method: 'POST',
      body: JSON.stringify({ events }),
    })
  }

  /**
   * Make HTTP request
   */
  private async fetch(path: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.host}${path}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Try to get error details from response body
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorBody = await response.text()
          if (errorBody) {
            errorMessage += ` - ${errorBody}`
          }
        } catch {
          // Ignore errors reading response body
        }
        throw new Error(errorMessage)
      }

      // Return empty object for 204 No Content
      if (response.status === 204) {
        return {}
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = new Error(
            `Request timeout after ${this.timeout}ms while fetching ${url}`
          )
          timeoutError.name = 'TimeoutError'
          if (this.debug) {
            console.error('[analytics.do] timeout:', timeoutError)
          }
          throw timeoutError
        }

        // Network errors
        if (error.message.includes('fetch') || error.message.includes('network')) {
          const networkError = new Error(`Network error while fetching ${url}: ${error.message}`)
          networkError.name = 'NetworkError'
          if (this.debug) {
            console.error('[analytics.do] network error:', networkError)
          }
          throw networkError
        }
      }

      // Generic error logging
      if (this.debug) {
        console.error('[analytics.do] error:', error)
      }
      throw error
    }
  }
}
