/**
 * Analytics Service for SDK.do
 *
 * Provides methods for event tracking, page views, conversions, and analytics queries.
 * Integrates with Analytics Engine for SQL queries and R2 for raw event storage.
 *
 * Data Flow:
 * 1. SDK → Analytics Worker: POST /track
 * 2. Analytics Worker → Analytics Engine: writeDataPoint() for instant SQL queries
 * 3. Analytics Worker → R2: Store raw JSON events
 * 4. Analytics Worker → Pipeline: Send to ANALYTICS_PIPELINE for aggregation
 * 5. Pipeline → R2 SQL: Aggregate data for complex queries
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Track custom event
 * await $.analytics.track('button_clicked', {
 *   buttonId: 'cta-signup',
 *   page: '/pricing'
 * })
 *
 * // Track page view
 * await $.analytics.page('/dashboard', {
 *   title: 'User Dashboard',
 *   referrer: '/login'
 * })
 *
 * // Identify user
 * await $.analytics.identify('user_123', {
 *   email: 'user@example.com',
 *   plan: 'pro'
 * })
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface TrackEventOptions {
  /**
   * Event type/name
   */
  type: string

  /**
   * Event properties
   */
  properties?: Record<string, any>

  /**
   * User ID
   */
  userId?: string

  /**
   * Anonymous ID
   */
  anonymousId?: string

  /**
   * Session ID
   */
  sessionId?: string

  /**
   * Event timestamp (ISO 8601)
   */
  timestamp?: string

  /**
   * UTM parameters
   */
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }

  /**
   * Page context
   */
  page?: {
    url?: string
    title?: string
    referrer?: string
    path?: string
  }

  /**
   * Device context
   */
  device?: {
    type?: string
    browser?: string
    os?: string
    screenWidth?: number
    screenHeight?: number
    language?: string
  }

  /**
   * Location context
   */
  location?: {
    country?: string
    city?: string
    region?: string
    timezone?: string
  }
}

export interface PageViewOptions {
  /**
   * Page URL
   */
  url: string

  /**
   * Page title
   */
  title?: string

  /**
   * Referrer URL
   */
  referrer?: string

  /**
   * Additional properties
   */
  properties?: Record<string, any>

  /**
   * User ID
   */
  userId?: string

  /**
   * UTM parameters
   */
  utm?: TrackEventOptions['utm']
}

export interface IdentifyOptions {
  /**
   * User ID
   */
  userId: string

  /**
   * User traits/properties
   */
  traits: Record<string, any>

  /**
   * Timestamp
   */
  timestamp?: string
}

export interface GroupOptions {
  /**
   * Group ID (organization, team, etc.)
   */
  groupId: string

  /**
   * Group traits/properties
   */
  traits: Record<string, any>

  /**
   * User ID
   */
  userId?: string

  /**
   * Timestamp
   */
  timestamp?: string
}

export interface TrackResponse {
  success: boolean
  id: string
  timestamp?: string
}

export interface PixelOptions {
  /**
   * Page URL to track
   */
  url?: string

  /**
   * Page title
   */
  title?: string

  /**
   * User ID
   */
  userId?: string

  /**
   * Session ID
   */
  sessionId?: string

  /**
   * Anonymous ID
   */
  anonymousId?: string

  /**
   * UTM parameters
   */
  utm?: TrackEventOptions['utm']

  /**
   * Custom parameters
   */
  [key: string]: any
}

export interface AnalyticsEvent {
  id: string
  timestamp: string
  type: string
  userId?: string
  anonymousId?: string
  sessionId?: string
  properties?: Record<string, any>
  utm?: Record<string, string>
  page?: Record<string, string>
  device?: Record<string, any>
  location?: Record<string, any>
  network?: Record<string, any>
  eventType: string
}

export interface ListEventsOptions {
  /**
   * Date to filter events (YYYY-MM-DD)
   */
  date?: string

  /**
   * Maximum events to return
   */
  limit?: number

  /**
   * Event type filter
   */
  type?: string

  /**
   * User ID filter
   */
  userId?: string
}

export interface ListEventsResponse {
  success: boolean
  count: number
  data: AnalyticsEvent[]
  date?: string
}

export interface AnalyticsMetrics {
  [key: string]: number | string | Record<string, any>
}

export interface UTMParameters {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export class AnalyticsService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://analytics.do', apiKey?: string) {
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
   * Track a custom event
   *
   * @param type - Event type/name
   * @param properties - Event properties
   * @returns Track response with event ID
   *
   * @example
   * ```typescript
   * await $.analytics.track('purchase_completed', {
   *   orderId: 'order_123',
   *   amount: 99.99,
   *   currency: 'USD',
   *   items: ['item_1', 'item_2']
   * })
   * ```
   */
  async track(type: string, properties?: Record<string, any>): Promise<TrackResponse> {
    const event: TrackEventOptions = {
      type,
      properties,
      timestamp: new Date().toISOString(),
    }

    const response = await fetch(`${this.baseUrl}/track`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to track event: ${error}`)
    }

    return response.json() as Promise<TrackResponse>
  }

  /**
   * Track a page view
   *
   * @param url - Page URL
   * @param options - Page view options
   * @returns Track response
   *
   * @example
   * ```typescript
   * await $.analytics.page('/dashboard', {
   *   title: 'User Dashboard',
   *   referrer: '/login',
   *   properties: { section: 'analytics' }
   * })
   * ```
   */
  async page(url: string, options: Omit<PageViewOptions, 'url'> = {}): Promise<TrackResponse> {
    const event: TrackEventOptions = {
      type: 'pageview',
      page: {
        url,
        title: options.title,
        referrer: options.referrer,
      },
      properties: options.properties,
      userId: options.userId,
      utm: options.utm,
      timestamp: new Date().toISOString(),
    }

    const response = await fetch(`${this.baseUrl}/track`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to track page view: ${error}`)
    }

    return response.json() as Promise<TrackResponse>
  }

  /**
   * Identify a user with traits
   *
   * @param userId - User ID
   * @param traits - User traits/properties
   * @returns Track response
   *
   * @example
   * ```typescript
   * await $.analytics.identify('user_123', {
   *   email: 'user@example.com',
   *   name: 'John Doe',
   *   plan: 'pro',
   *   createdAt: '2025-01-01'
   * })
   * ```
   */
  async identify(userId: string, traits: Record<string, any>): Promise<TrackResponse> {
    const event: TrackEventOptions = {
      type: 'identify',
      userId,
      properties: traits,
      timestamp: new Date().toISOString(),
    }

    const response = await fetch(`${this.baseUrl}/track`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to identify user: ${error}`)
    }

    return response.json() as Promise<TrackResponse>
  }

  /**
   * Associate a user with a group (organization, team, etc.)
   *
   * @param groupId - Group ID
   * @param traits - Group traits/properties
   * @param userId - Optional user ID
   * @returns Track response
   *
   * @example
   * ```typescript
   * await $.analytics.group('org_123', {
   *   name: 'Acme Corp',
   *   plan: 'enterprise',
   *   employees: 500
   * }, 'user_123')
   * ```
   */
  async group(groupId: string, traits: Record<string, any>, userId?: string): Promise<TrackResponse> {
    const event: TrackEventOptions = {
      type: 'group',
      userId,
      properties: {
        groupId,
        ...traits,
      },
      timestamp: new Date().toISOString(),
    }

    const response = await fetch(`${this.baseUrl}/track`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to track group: ${error}`)
    }

    return response.json() as Promise<TrackResponse>
  }

  /**
   * Generate tracking pixel URL
   *
   * @param options - Pixel options
   * @returns Tracking pixel URL
   *
   * @example
   * ```typescript
   * const pixelUrl = $.analytics.pixel({
   *   url: 'https://example.com/page',
   *   userId: 'user_123',
   *   utm: { source: 'email', campaign: 'welcome' }
   * })
   *
   * // Use in HTML:
   * // <img src="{pixelUrl}" width="1" height="1" alt="" />
   * ```
   */
  pixel(options: PixelOptions = {}): string {
    const params = new URLSearchParams()

    if (options.url) params.set('url', options.url)
    if (options.title) params.set('title', options.title)
    if (options.userId) params.set('user_id', options.userId)
    if (options.sessionId) params.set('session_id', options.sessionId)
    if (options.anonymousId) params.set('anonymous_id', options.anonymousId)

    // UTM parameters
    if (options.utm) {
      if (options.utm.source) params.set('utm_source', options.utm.source)
      if (options.utm.medium) params.set('utm_medium', options.utm.medium)
      if (options.utm.campaign) params.set('utm_campaign', options.utm.campaign)
      if (options.utm.term) params.set('utm_term', options.utm.term)
      if (options.utm.content) params.set('utm_content', options.utm.content)
    }

    // Custom parameters (excluding known fields)
    const knownFields = ['url', 'title', 'userId', 'sessionId', 'anonymousId', 'utm']
    Object.entries(options).forEach(([key, value]) => {
      if (!knownFields.includes(key) && value != null) {
        params.set(key, String(value))
      }
    })

    return `${this.baseUrl}/e?${params.toString()}`
  }

  /**
   * List events from R2 storage
   *
   * @param options - List options
   * @returns List of events
   *
   * @example
   * ```typescript
   * const events = await $.analytics.events({
   *   date: '2025-10-11',
   *   limit: 50,
   *   type: 'purchase_completed'
   * })
   * ```
   */
  async events(options: ListEventsOptions = {}): Promise<ListEventsResponse> {
    const params = new URLSearchParams()

    if (options.date) params.set('date', options.date)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.type) params.set('type', options.type)
    if (options.userId) params.set('userId', options.userId)

    const response = await fetch(`${this.baseUrl}/events?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to list events: ${response.statusText}`)
    }

    return response.json() as Promise<ListEventsResponse>
  }

  /**
   * Parse UTM parameters from URL
   *
   * @param url - URL to parse
   * @returns UTM parameters object
   *
   * @example
   * ```typescript
   * const utm = $.analytics.parseUTM('https://example.com?utm_source=google&utm_campaign=summer')
   * // { utm_source: 'google', utm_campaign: 'summer' }
   * ```
   */
  parseUTM(url: string): UTMParameters {
    const urlObj = new URL(url)
    const params: UTMParameters = {}

    const utmKeys: Array<keyof UTMParameters> = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

    utmKeys.forEach((key) => {
      const value = urlObj.searchParams.get(key)
      if (value) {
        params[key] = value
      }
    })

    return params
  }

  /**
   * Generate URL with UTM parameters
   *
   * @param baseUrl - Base URL
   * @param utm - UTM parameters
   * @returns URL with UTM parameters
   *
   * @example
   * ```typescript
   * const url = $.analytics.withUTM('https://example.com', {
   *   utm_source: 'email',
   *   utm_campaign: 'welcome',
   *   utm_medium: 'email'
   * })
   * ```
   */
  withUTM(baseUrl: string, utm: UTMParameters): string {
    const url = new URL(baseUrl)

    Object.entries(utm).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value)
      }
    })

    return url.toString()
  }

  /**
   * Helper method to track a conversion event
   *
   * @param conversionType - Type of conversion
   * @param value - Conversion value (revenue, etc.)
   * @param properties - Additional properties
   * @returns Track response
   *
   * @example
   * ```typescript
   * await $.analytics.conversion('purchase', 99.99, {
   *   orderId: 'order_123',
   *   currency: 'USD'
   * })
   * ```
   */
  async conversion(conversionType: string, value: number, properties?: Record<string, any>): Promise<TrackResponse> {
    return this.track('conversion', {
      conversionType,
      value,
      ...properties,
    })
  }
}

/**
 * Create analytics service instance
 */
export function createAnalyticsService(baseUrl?: string, apiKey?: string): AnalyticsService {
  return new AnalyticsService(baseUrl, apiKey)
}

/**
 * Default analytics service instance
 */
export const analytics = createAnalyticsService()
