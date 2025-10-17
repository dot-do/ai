/**
 * Help Scout Webhooks
 *
 * Auto-generated webhook handling for Help Scout Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/helpscout
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  CONVERSATION_CREATED: 'convo.created',
  CONVERSATION_UPDATED: 'convo.updated',
  CONVERSATION_DELETED: 'convo.deleted',
  CONVERSATION_STATUS: 'convo.status',
  CONVERSATION_ASSIGNED: 'convo.assigned',
  CONVERSATION_MOVED: 'convo.moved',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface ConversationCreatedEvent {
  type: 'convo.created'
  data: any
  timestamp: string
  id: string
}

export interface ConversationUpdatedEvent {
  type: 'convo.updated'
  data: any
  timestamp: string
  id: string
}

export interface ConversationDeletedEvent {
  type: 'convo.deleted'
  data: any
  timestamp: string
  id: string
}

export interface ConversationStatusEvent {
  type: 'convo.status'
  data: any
  timestamp: string
  id: string
}

export interface ConversationAssignedEvent {
  type: 'convo.assigned'
  data: any
  timestamp: string
  id: string
}

export interface ConversationMovedEvent {
  type: 'convo.moved'
  data: any
  timestamp: string
  id: string
}

export interface CustomerCreatedEvent {
  type: 'customer.created'
  data: any
  timestamp: string
  id: string
}

export interface CustomerUpdatedEvent {
  type: 'customer.updated'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | ConversationCreatedEvent
  | ConversationUpdatedEvent
  | ConversationDeletedEvent
  | ConversationStatusEvent
  | ConversationAssignedEvent
  | ConversationMovedEvent
  | CustomerCreatedEvent
  | CustomerUpdatedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-HelpScout-Signature': string
  payload: string
}

/**
 * Help Scout Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class HelpscoutWebhookHandler {
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
    return this.secureCompare(options['X-HelpScout-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-HelpScout-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-HelpScout-Signature': signature, payload })) {
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
   * Register handler for conversation.created events
   * @param handler - Event handler function
   */
  onConversationCreated(handler: (event: ConversationCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_CREATED, handler as any)
  }

  /**
   * Register handler for conversation.updated events
   * @param handler - Event handler function
   */
  onConversationUpdated(handler: (event: ConversationUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_UPDATED, handler as any)
  }

  /**
   * Register handler for conversation.deleted events
   * @param handler - Event handler function
   */
  onConversationDeleted(handler: (event: ConversationDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_DELETED, handler as any)
  }

  /**
   * Register handler for conversation.status events
   * @param handler - Event handler function
   */
  onConversationStatus(handler: (event: ConversationStatusEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_STATUS, handler as any)
  }

  /**
   * Register handler for conversation.assigned events
   * @param handler - Event handler function
   */
  onConversationAssigned(handler: (event: ConversationAssignedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_ASSIGNED, handler as any)
  }

  /**
   * Register handler for conversation.moved events
   * @param handler - Event handler function
   */
  onConversationMoved(handler: (event: ConversationMovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_MOVED, handler as any)
  }

  /**
   * Register handler for customer.created events
   * @param handler - Event handler function
   */
  onCustomerCreated(handler: (event: CustomerCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CUSTOMER_CREATED, handler as any)
  }

  /**
   * Register handler for customer.updated events
   * @param handler - Event handler function
   */
  onCustomerUpdated(handler: (event: CustomerUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CUSTOMER_UPDATED, handler as any)
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
