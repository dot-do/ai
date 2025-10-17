/**
 * Mailchimp Webhooks
 *
 * Auto-generated webhook handling for Mailchimp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailchimp
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  PROFILE: 'profile',
  CLEANED: 'cleaned',
  UPEMAIL: 'upemail',
  CAMPAIGN: 'campaign',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface SubscribeEvent {
  type: 'subscribe'
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

export interface ProfileEvent {
  type: 'profile'
  data: any
  timestamp: string
  id: string
}

export interface CleanedEvent {
  type: 'cleaned'
  data: any
  timestamp: string
  id: string
}

export interface UpemailEvent {
  type: 'upemail'
  data: any
  timestamp: string
  id: string
}

export interface CampaignEvent {
  type: 'campaign'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = SubscribeEvent | UnsubscribeEvent | ProfileEvent | CleanedEvent | UpemailEvent | CampaignEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Mandrill-Signature': string
  payload: string
}

/**
 * Mailchimp Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class MailchimpWebhookHandler {
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
    return this.secureCompare(options['X-Mandrill-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Mandrill-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Mandrill-Signature': signature, payload })) {
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
   * Register handler for subscribe events
   * @param handler - Event handler function
   */
  onSubscribe(handler: (event: SubscribeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIBE, handler as any)
  }

  /**
   * Register handler for unsubscribe events
   * @param handler - Event handler function
   */
  onUnsubscribe(handler: (event: UnsubscribeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.UNSUBSCRIBE, handler as any)
  }

  /**
   * Register handler for profile events
   * @param handler - Event handler function
   */
  onProfile(handler: (event: ProfileEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PROFILE, handler as any)
  }

  /**
   * Register handler for cleaned events
   * @param handler - Event handler function
   */
  onCleaned(handler: (event: CleanedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CLEANED, handler as any)
  }

  /**
   * Register handler for upemail events
   * @param handler - Event handler function
   */
  onUpemail(handler: (event: UpemailEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.UPEMAIL, handler as any)
  }

  /**
   * Register handler for campaign events
   * @param handler - Event handler function
   */
  onCampaign(handler: (event: CampaignEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CAMPAIGN, handler as any)
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
