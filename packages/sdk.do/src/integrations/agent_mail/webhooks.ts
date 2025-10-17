/**
 * Agent mail Webhooks
 *
 * Auto-generated webhook handling for Agent mail Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/agent_mail
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  GENERIC_TRIGGER: 'trigger',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface GenericTriggerEvent {
  type: 'trigger'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = GenericTriggerEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {}

/**
 * Agent mail Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class AgentMailWebhookHandler {
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
   * Register handler for generic_trigger events
   * @param handler - Event handler function
   */
  onGenericTrigger(handler: (event: GenericTriggerEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GENERIC_TRIGGER, handler as any)
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
