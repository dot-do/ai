/**
 * Calendly Webhooks
 *
 * Auto-generated webhook handling for Calendly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/calendly
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  INVITEE_CREATED: 'invitee.created',
  INVITEE_CANCELED: 'invitee.canceled',
  ROUTING_FORM_SUBMISSION_CREATED: 'routing_form_submission.created',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface InviteeCreatedEvent {
  type: 'invitee.created'
  data: any
  timestamp: string
  id: string
}

export interface InviteeCanceledEvent {
  type: 'invitee.canceled'
  data: any
  timestamp: string
  id: string
}

export interface RoutingFormSubmissionCreatedEvent {
  type: 'routing_form_submission.created'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = InviteeCreatedEvent | InviteeCanceledEvent | RoutingFormSubmissionCreatedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'Calendly-Webhook-Signature': string
  payload: string
}

/**
 * Calendly Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class CalendlyWebhookHandler {
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
    return this.secureCompare(options['Calendly-Webhook-Signature'], expectedSignature)
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
    const signature = request.headers.get('Calendly-Webhook-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'Calendly-Webhook-Signature': signature, payload })) {
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
   * Register handler for invitee.created events
   * @param handler - Event handler function
   */
  onInviteeCreated(handler: (event: InviteeCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.INVITEE_CREATED, handler as any)
  }

  /**
   * Register handler for invitee.canceled events
   * @param handler - Event handler function
   */
  onInviteeCanceled(handler: (event: InviteeCanceledEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.INVITEE_CANCELED, handler as any)
  }

  /**
   * Register handler for routing_form_submission.created events
   * @param handler - Event handler function
   */
  onRoutingFormSubmissionCreated(handler: (event: RoutingFormSubmissionCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ROUTING_FORM_SUBMISSION_CREATED, handler as any)
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
