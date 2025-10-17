/**
 * analytics.do SDK - Browser-specific Features
 */

import { AnalyticsClient } from '../src/client'
import type { AnalyticsConfig } from '../src/types'

export * from '../src/index'

export interface BrowserConfig extends AnalyticsConfig {
  autoTrackPageViews?: boolean
  autoTrackClicks?: boolean
  clickSelector?: string
}

export class BrowserAnalytics extends AnalyticsClient {
  private autoTrackPageViews: boolean
  private autoTrackClicks: boolean
  private clickSelector: string
  private initialized = false
  private originalPushState?: typeof history.pushState
  private originalReplaceState?: typeof history.replaceState

  constructor(config: BrowserConfig = {}) {
    super(config)
    this.autoTrackPageViews = config.autoTrackPageViews ?? true
    this.autoTrackClicks = config.autoTrackClicks ?? false
    this.clickSelector = config.clickSelector || '[data-track]'
  }

  /**
   * Initialize browser tracking
   */
  init(): void {
    if (this.initialized) return
    this.initialized = true

    // Track initial pageview
    if (this.autoTrackPageViews) {
      this.page()
    }

    // Track navigation events (SPA)
    if (this.autoTrackPageViews && typeof window !== 'undefined') {
      this.trackNavigation()
    }

    // Track clicks
    if (this.autoTrackClicks && typeof document !== 'undefined') {
      this.trackClicks()
    }

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush()
      })
    }
  }

  /**
   * Track navigation events (History API)
   */
  private trackNavigation(): void {
    // Store originals if not already stored
    if (!this.originalPushState) {
      this.originalPushState = history.pushState
    }
    if (!this.originalReplaceState) {
      this.originalReplaceState = history.replaceState
    }

    // Track pushState
    history.pushState = (...args) => {
      this.originalPushState!.apply(history, args)
      this.page()
    }

    // Track replaceState
    history.replaceState = (...args) => {
      this.originalReplaceState!.apply(history, args)
      this.page()
    }

    // Track popstate (back/forward)
    window.addEventListener('popstate', () => {
      this.page()
    })
  }

  /**
   * Track click events
   */
  private trackClicks(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const trackable = target.closest(this.clickSelector) as HTMLElement

      if (trackable) {
        const event = this.sanitizeString(trackable.getAttribute('data-track') || 'element_clicked')
        const properties: Record<string, any> = {}

        // Extract data attributes with sanitization
        Array.from(trackable.attributes).forEach((attr) => {
          if (attr.name.startsWith('data-track-')) {
            const key = attr.name.replace('data-track-', '')
            properties[key] = this.sanitizeString(attr.value)
          }
        })

        // Add default properties with sanitization
        properties.element_type = trackable.tagName.toLowerCase()
        properties.element_id = trackable.id ? this.sanitizeString(trackable.id) : undefined
        properties.element_class = trackable.className
          ? this.sanitizeString(trackable.className)
          : undefined
        properties.element_text = trackable.textContent
          ? this.sanitizeString(trackable.textContent.trim().substring(0, 100))
          : undefined

        this.track(event, properties)
      }
    })
  }

  /**
   * Sanitize string to prevent XSS and remove sensitive data patterns
   */
  private sanitizeString(value: string): string {
    // Remove HTML tags
    let sanitized = value.replace(/<[^>]*>/g, '')

    // Remove potential XSS patterns
    sanitized = sanitized.replace(/javascript:/gi, '')
    sanitized = sanitized.replace(/on\w+\s*=/gi, '')

    // Remove sensitive data patterns (credit cards, SSN, etc.)
    sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[REDACTED]')
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED]')

    return sanitized
  }
}

// Browser singleton
let browserClient: BrowserAnalytics | null = null

export function init(config: BrowserConfig): BrowserAnalytics {
  browserClient = new BrowserAnalytics(config)
  browserClient.init()
  return browserClient
}

export function getClient(): BrowserAnalytics {
  if (!browserClient) {
    throw new Error('Browser analytics not initialized. Call init() first.')
  }
  return browserClient
}

export const analytics = {
  init,
  track: (...args: Parameters<BrowserAnalytics['track']>) => getClient().track(...args),
  page: (...args: Parameters<BrowserAnalytics['page']>) => getClient().page(...args),
  identify: (...args: Parameters<BrowserAnalytics['identify']>) => getClient().identify(...args),
  group: (...args: Parameters<BrowserAnalytics['group']>) => getClient().group(...args),
  alias: (...args: Parameters<BrowserAnalytics['alias']>) => getClient().alias(...args),
  flush: () => getClient().flush(),
}
