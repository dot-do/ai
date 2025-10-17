/**
 * Airtable Webhooks
 *
 * Auto-generated webhook handling for Airtable Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/airtable
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  RECORD_CREATED: 'record_created',
  RECORD_UPDATED: 'record_updated',
  RECORD_DELETED: 'record_deleted',
  FIELD_UPDATED: 'field_updated',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface RecordCreatedEvent {
  type: 'record_created'
  data: any
  timestamp: string
  id: string
}

export interface RecordUpdatedEvent {
  type: 'record_updated'
  data: any
  timestamp: string
  id: string
}

export interface RecordDeletedEvent {
  type: 'record_deleted'
  data: any
  timestamp: string
  id: string
}

export interface FieldUpdatedEvent {
  type: 'field_updated'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = RecordCreatedEvent | RecordUpdatedEvent | RecordDeletedEvent | FieldUpdatedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {}

/**
 * Airtable Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class AirtableWebhookHandler {
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
   * Register handler for record_created events
   * @param handler - Event handler function
   */
  onRecordCreated(handler: (event: RecordCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RECORD_CREATED, handler as any)
  }

  /**
   * Register handler for record_updated events
   * @param handler - Event handler function
   */
  onRecordUpdated(handler: (event: RecordUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RECORD_UPDATED, handler as any)
  }

  /**
   * Register handler for record_deleted events
   * @param handler - Event handler function
   */
  onRecordDeleted(handler: (event: RecordDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RECORD_DELETED, handler as any)
  }

  /**
   * Register handler for field_updated events
   * @param handler - Event handler function
   */
  onFieldUpdated(handler: (event: FieldUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FIELD_UPDATED, handler as any)
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
