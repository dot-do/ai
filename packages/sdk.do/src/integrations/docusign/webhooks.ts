/**
 * DocuSign Webhooks
 *
 * Auto-generated webhook handling for DocuSign Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/docusign
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  ENVELOPE_SENT: 'envelope-sent',
  ENVELOPE_DELIVERED: 'envelope-delivered',
  ENVELOPE_COMPLETED: 'envelope-completed',
  ENVELOPE_DECLINED: 'envelope-declined',
  ENVELOPE_VOIDED: 'envelope-voided',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface EnvelopeSentEvent {
  type: 'envelope-sent'
  data: any
  timestamp: string
  id: string
}

export interface EnvelopeDeliveredEvent {
  type: 'envelope-delivered'
  data: any
  timestamp: string
  id: string
}

export interface EnvelopeCompletedEvent {
  type: 'envelope-completed'
  data: any
  timestamp: string
  id: string
}

export interface EnvelopeDeclinedEvent {
  type: 'envelope-declined'
  data: any
  timestamp: string
  id: string
}

export interface EnvelopeVoidedEvent {
  type: 'envelope-voided'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = EnvelopeSentEvent | EnvelopeDeliveredEvent | EnvelopeCompletedEvent | EnvelopeDeclinedEvent | EnvelopeVoidedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {}

/**
 * DocuSign Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class DocusignWebhookHandler {
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
    // No verification method configured
    return true
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
   * Register handler for envelope-sent events
   * @param handler - Event handler function
   */
  onEnvelopeSent(handler: (event: EnvelopeSentEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ENVELOPE_SENT, handler as any)
  }

  /**
   * Register handler for envelope-delivered events
   * @param handler - Event handler function
   */
  onEnvelopeDelivered(handler: (event: EnvelopeDeliveredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ENVELOPE_DELIVERED, handler as any)
  }

  /**
   * Register handler for envelope-completed events
   * @param handler - Event handler function
   */
  onEnvelopeCompleted(handler: (event: EnvelopeCompletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ENVELOPE_COMPLETED, handler as any)
  }

  /**
   * Register handler for envelope-declined events
   * @param handler - Event handler function
   */
  onEnvelopeDeclined(handler: (event: EnvelopeDeclinedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ENVELOPE_DECLINED, handler as any)
  }

  /**
   * Register handler for envelope-voided events
   * @param handler - Event handler function
   */
  onEnvelopeVoided(handler: (event: EnvelopeVoidedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ENVELOPE_VOIDED, handler as any)
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
