/**
 * SendGrid Webhooks
 *
 * Auto-generated webhook handling for SendGrid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sendgrid
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  PROCESSED: 'processed',
  DROPPED: 'dropped',
  DELIVERED: 'delivered',
  DEFERRED: 'deferred',
  BOUNCE: 'bounce',
  OPEN: 'open',
  CLICK: 'click',
  SPAM_REPORT: 'spam_report',
  UNSUBSCRIBE: 'unsubscribe',
  GROUP_UNSUBSCRIBE: 'group_unsubscribe',
  GROUP_RESUBSCRIBE: 'group_resubscribe',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface ProcessedEvent {
  type: 'processed'
  data: any
  timestamp: string
  id: string
}

export interface DroppedEvent {
  type: 'dropped'
  data: any
  timestamp: string
  id: string
}

export interface DeliveredEvent {
  type: 'delivered'
  data: any
  timestamp: string
  id: string
}

export interface DeferredEvent {
  type: 'deferred'
  data: any
  timestamp: string
  id: string
}

export interface BounceEvent {
  type: 'bounce'
  data: any
  timestamp: string
  id: string
}

export interface OpenEvent {
  type: 'open'
  data: any
  timestamp: string
  id: string
}

export interface ClickEvent {
  type: 'click'
  data: any
  timestamp: string
  id: string
}

export interface SpamReportEvent {
  type: 'spam_report'
  data: any
  timestamp: string
  id: string
}

export interface UnsubscribeEvent {
  type: 'unsubscribe'
  data: any
  timestamp: string
  id: string
}

export interface GroupUnsubscribeEvent {
  type: 'group_unsubscribe'
  data: any
  timestamp: string
  id: string
}

export interface GroupResubscribeEvent {
  type: 'group_resubscribe'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | ProcessedEvent
  | DroppedEvent
  | DeliveredEvent
  | DeferredEvent
  | BounceEvent
  | OpenEvent
  | ClickEvent
  | SpamReportEvent
  | UnsubscribeEvent
  | GroupUnsubscribeEvent
  | GroupResubscribeEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Twilio-Email-Event-Webhook-Signature': string
  payload: string
}

/**
 * SendGrid Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class SendgridWebhookHandler {
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
    return this.secureCompare(options['X-Twilio-Email-Event-Webhook-Signature'], expectedSignature)
  }

  /**
   * Generate webhook signature
   * @param payload - Webhook payload
   * @returns HMAC signature
   */
  private generateSignature(payload: string): string {
    const hmac = createHmac('sha256', this.secret)
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
    const signature = request.headers.get('X-Twilio-Email-Event-Webhook-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Twilio-Email-Event-Webhook-Signature': signature, payload })) {
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
   * Register handler for processed events
   * @param handler - Event handler function
   */
  onProcessed(handler: (event: ProcessedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PROCESSED, handler as any)
  }

  /**
   * Register handler for dropped events
   * @param handler - Event handler function
   */
  onDropped(handler: (event: DroppedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DROPPED, handler as any)
  }

  /**
   * Register handler for delivered events
   * @param handler - Event handler function
   */
  onDelivered(handler: (event: DeliveredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DELIVERED, handler as any)
  }

  /**
   * Register handler for deferred events
   * @param handler - Event handler function
   */
  onDeferred(handler: (event: DeferredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DEFERRED, handler as any)
  }

  /**
   * Register handler for bounce events
   * @param handler - Event handler function
   */
  onBounce(handler: (event: BounceEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BOUNCE, handler as any)
  }

  /**
   * Register handler for open events
   * @param handler - Event handler function
   */
  onOpen(handler: (event: OpenEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.OPEN, handler as any)
  }

  /**
   * Register handler for click events
   * @param handler - Event handler function
   */
  onClick(handler: (event: ClickEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CLICK, handler as any)
  }

  /**
   * Register handler for spam_report events
   * @param handler - Event handler function
   */
  onSpamReport(handler: (event: SpamReportEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SPAM_REPORT, handler as any)
  }

  /**
   * Register handler for unsubscribe events
   * @param handler - Event handler function
   */
  onUnsubscribe(handler: (event: UnsubscribeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.UNSUBSCRIBE, handler as any)
  }

  /**
   * Register handler for group_unsubscribe events
   * @param handler - Event handler function
   */
  onGroupUnsubscribe(handler: (event: GroupUnsubscribeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GROUP_UNSUBSCRIBE, handler as any)
  }

  /**
   * Register handler for group_resubscribe events
   * @param handler - Event handler function
   */
  onGroupResubscribe(handler: (event: GroupResubscribeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GROUP_RESUBSCRIBE, handler as any)
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
