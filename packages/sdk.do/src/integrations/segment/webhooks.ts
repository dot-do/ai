/**
 * Segment Webhooks
 *
 * Auto-generated webhook handling for Segment Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/segment
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  TRACK: 'track',
  IDENTIFY: 'identify',
  GROUP: 'group',
  PAGE: 'page',
  SCREEN: 'screen',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface TrackEvent {
  type: 'track'
  data: any
  timestamp: string
  id: string
}

export interface IdentifyEvent {
  type: 'identify'
  data: any
  timestamp: string
  id: string
}

export interface GroupEvent {
  type: 'group'
  data: any
  timestamp: string
  id: string
}

export interface PageEvent {
  type: 'page'
  data: any
  timestamp: string
  id: string
}

export interface ScreenEvent {
  type: 'screen'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = TrackEvent | IdentifyEvent | GroupEvent | PageEvent | ScreenEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Signature': string
  payload: string
}

/**
 * Segment Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class SegmentWebhookHandler {
  private secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  /**
   * Verify webhook signature
   * @param options - Verification options
   * @returns True if signature is valid
   */
  verify(options: WebhookVerificationOptions): boolean {
    const expectedSignature = this.generateSignature(options.payload)
    return this.secureCompare(options['X-Signature'], expectedSignature)
  }

  /**
   * Generate webhook signature
   * @param payload - Webhook payload
   * @returns HMAC signature
   */
  private generateSignature(payload: string): string {
    const hmac = createHmac('sha1', this.secret)
    hmac.update(payload)
    return hmac.digest('hex')
  }

  /**
   * Secure string comparison (timing-safe)
   * @param a - First string
   * @param b - Second string
   * @returns True if strings match
   */
  private secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return result === 0
  }

  /**
   * Parse webhook event
   * @param payload - Webhook payload string
   * @returns Parsed webhook event
   */
  parseEvent(payload: string): WebhookEvent {
    const event = JSON.parse(payload)

    if (!event.type || !event.data) {
      throw new Error('Invalid webhook event structure')
    }

    return event as WebhookEvent
  }

  /**
   * Handle webhook request
   * @param request - HTTP request
   * @returns Parsed webhook event
   * @throws Error if verification fails
   */
  async handleRequest(request: Request): Promise<WebhookEvent> {
    const payload = await request.text()
    const signature = request.headers.get('X-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Signature': signature, payload })) {
      throw new Error('Invalid webhook signature')
    }

    return this.parseEvent(payload)
  }
}

/**
 * Webhook Event Router
 *
 * Route webhook events to handlers based on event type.
 */
export class WebhookEventRouter {
  private handlers = new Map<string, (event: WebhookEvent) => Promise<void>>()

  /**
   * Register event handler
   * @param eventType - Event type to handle
   * @param handler - Event handler function
   */
  on(eventType: WebhookEventType, handler: (event: WebhookEvent) => Promise<void>): void {
    this.handlers.set(eventType, handler)
  }

  /**
   * Register handler for track events
   * @param handler - Event handler function
   */
  onTrack(handler: (event: TrackEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TRACK, handler as any)
  }

  /**
   * Register handler for identify events
   * @param handler - Event handler function
   */
  onIdentify(handler: (event: IdentifyEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.IDENTIFY, handler as any)
  }

  /**
   * Register handler for group events
   * @param handler - Event handler function
   */
  onGroup(handler: (event: GroupEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GROUP, handler as any)
  }

  /**
   * Register handler for page events
   * @param handler - Event handler function
   */
  onPage(handler: (event: PageEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAGE, handler as any)
  }

  /**
   * Register handler for screen events
   * @param handler - Event handler function
   */
  onScreen(handler: (event: ScreenEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SCREEN, handler as any)
  }

  /**
   * Route event to appropriate handler
   * @param event - Webhook event
   */
  async route(event: WebhookEvent): Promise<void> {
    const handler = this.handlers.get(event.type)

    if (!handler) {
      throw new Error(`No handler registered for event type: ${event.type}`)
    }

    await handler(event)
  }
}
