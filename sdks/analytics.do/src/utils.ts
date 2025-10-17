/**
 * analytics.do SDK - Utility Functions
 */

import type { EventContext } from './types'

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Get current ISO timestamp
 */
export function getTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Extract UTM parameters from URL
 */
export function extractUtmParams(url?: string): Record<string, string> | undefined {
  if (!url) return undefined

  try {
    const parsed = new URL(url)
    const params: Record<string, string> = {}
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

    for (const key of utmKeys) {
      const value = parsed.searchParams.get(key)
      if (value) {
        params[key.replace('utm_', '')] = value
      }
    }

    return Object.keys(params).length > 0 ? params : undefined
  } catch {
    return undefined
  }
}

/**
 * Get page context (browser environment)
 */
export function getPageContext(): EventContext['page'] | undefined {
  if (typeof window === 'undefined') return undefined

  return {
    title: document?.title,
    url: window.location.href,
    path: window.location.pathname,
    referrer: document?.referrer || undefined,
    search: window.location.search || undefined,
  }
}

/**
 * Get screen context (browser environment)
 */
export function getScreenContext(): EventContext['screen'] | undefined {
  if (typeof window === 'undefined') return undefined

  return {
    width: window.screen?.width,
    height: window.screen?.height,
  }
}

/**
 * Get user agent (browser environment)
 */
export function getUserAgent(): string | undefined {
  if (typeof navigator === 'undefined') return undefined
  return navigator.userAgent
}

/**
 * Get locale (browser environment)
 */
export function getLocale(): string | undefined {
  if (typeof navigator === 'undefined') return undefined
  return navigator.language
}

/**
 * Get timezone
 */
export function getTimezone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return undefined
  }
}

/**
 * Enrich event with automatic context
 */
export function enrichContext(context?: Partial<EventContext>): EventContext {
  const enriched: EventContext = {
    library: {
      name: 'analytics.do',
      version: '1.0.0',
    },
    ...context,
  }

  // Add browser context if available
  if (typeof window !== 'undefined') {
    enriched.page = enriched.page || getPageContext()
    enriched.screen = enriched.screen || getScreenContext()
    enriched.userAgent = enriched.userAgent || getUserAgent()
    enriched.locale = enriched.locale || getLocale()
    enriched.timezone = enriched.timezone || getTimezone()

    // Extract UTM parameters
    const campaign = extractUtmParams(window.location.href)
    if (campaign) {
      enriched.campaign = { ...campaign, ...enriched.campaign }
    }
  }

  return enriched
}

/**
 * Validate event name
 */
export function validateEventName(event: string): void {
  if (!event || typeof event !== 'string') {
    throw new Error('Event name must be a non-empty string')
  }
  if (event.length > 255) {
    throw new Error('Event name must be less than 255 characters')
  }
}

/**
 * Validate user ID
 */
export function validateUserId(userId: string): void {
  if (!userId || typeof userId !== 'string') {
    throw new Error('User ID must be a non-empty string')
  }
  if (userId.length > 255) {
    throw new Error('User ID must be less than 255 characters')
  }
}

/**
 * Get or create anonymous ID (browser environment)
 */
export function getAnonymousId(): string | undefined {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return undefined
  }

  try {
    const key = 'analytics_anonymous_id'
    let anonymousId = localStorage.getItem(key)

    if (!anonymousId) {
      anonymousId = generateMessageId()
      try {
        localStorage.setItem(key, anonymousId)
      } catch {
        // localStorage might be disabled or quota exceeded
      }
    }

    return anonymousId
  } catch {
    // localStorage access might throw in private browsing mode or when disabled
    return undefined
  }
}

/**
 * Batch events by time window
 */
export class EventBatcher<T> {
  private events: T[] = []
  private timer: NodeJS.Timeout | number | null = null
  private flushCallback: (events: T[]) => Promise<void>
  private batchSize: number
  private batchInterval: number
  private retryCount: Map<T, number> = new Map()
  private maxRetries: number
  private flushing = false

  constructor(
    flushCallback: (events: T[]) => Promise<void>,
    batchSize = 100,
    batchInterval = 5000,
    maxRetries = 3
  ) {
    this.flushCallback = flushCallback
    this.batchSize = batchSize
    this.batchInterval = batchInterval
    this.maxRetries = maxRetries
  }

  add(event: T): void {
    this.events.push(event)

    // Don't check batch size if currently flushing
    if (this.flushing) {
      return
    }

    // Flush if batch size reached
    if (this.events.length >= this.batchSize) {
      this.flush()
      return
    }

    // Schedule flush if not already scheduled
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flush()
      }, this.batchInterval)
    }
  }

  async flush(): Promise<void> {
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if (this.events.length === 0) return

    // Set flushing flag to prevent race conditions
    this.flushing = true

    const eventsToFlush = this.events
    this.events = []

    try {
      await this.flushCallback(eventsToFlush)
      // Clear retry counts on success
      for (const event of eventsToFlush) {
        this.retryCount.delete(event)
      }
    } catch (error) {
      // Filter events based on retry count
      const eventsToRetry: T[] = []
      const failedEvents: T[] = []

      for (const event of eventsToFlush) {
        const retries = this.retryCount.get(event) || 0
        if (retries < this.maxRetries) {
          this.retryCount.set(event, retries + 1)
          eventsToRetry.push(event)
        } else {
          failedEvents.push(event)
          this.retryCount.delete(event)
        }
      }

      // Re-add events that haven't exceeded retry limit
      this.events = [...eventsToRetry, ...this.events]

      // Log failed events that exceeded retry limit
      if (failedEvents.length > 0) {
        console.error(
          `[EventBatcher] Failed to flush ${failedEvents.length} events after ${this.maxRetries} retries`
        )
      }

      throw error
    } finally {
      // Always clear flushing flag
      this.flushing = false
    }
  }
}
