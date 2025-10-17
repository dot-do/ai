/**
 * Intercom Webhooks
 *
 * Auto-generated webhook handling for Intercom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/intercom
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  CONVERSATION_CREATED: 'conversation.created',
  CONVERSATION_ADMIN_REPLIED: 'conversation.admin.replied',
  CONVERSATION_USER_REPLIED: 'conversation.user.replied',
  CONVERSATION_CLOSED: 'conversation.closed',
  CONVERSATION_OPENED: 'conversation.opened',
  CONTACT_CREATED: 'contact.created',
  CONTACT_UPDATED: 'contact.updated',
  CONTACT_DELETED: 'contact.deleted',
  CONTACT_TAG_CREATED: 'contact.tag.created',
  CONTACT_TAG_DELETED: 'contact.tag.deleted',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface ConversationCreatedEvent {
  type: 'conversation.created'
  data: any
  timestamp: string
  id: string
}

export interface ConversationAdminRepliedEvent {
  type: 'conversation.admin.replied'
  data: any
  timestamp: string
  id: string
}

export interface ConversationUserRepliedEvent {
  type: 'conversation.user.replied'
  data: any
  timestamp: string
  id: string
}

export interface ConversationClosedEvent {
  type: 'conversation.closed'
  data: any
  timestamp: string
  id: string
}

export interface ConversationOpenedEvent {
  type: 'conversation.opened'
  data: any
  timestamp: string
  id: string
}

export interface ContactCreatedEvent {
  type: 'contact.created'
  data: any
  timestamp: string
  id: string
}

export interface ContactUpdatedEvent {
  type: 'contact.updated'
  data: any
  timestamp: string
  id: string
}

export interface ContactDeletedEvent {
  type: 'contact.deleted'
  data: any
  timestamp: string
  id: string
}

export interface ContactTagCreatedEvent {
  type: 'contact.tag.created'
  data: any
  timestamp: string
  id: string
}

export interface ContactTagDeletedEvent {
  type: 'contact.tag.deleted'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | ConversationCreatedEvent
  | ConversationAdminRepliedEvent
  | ConversationUserRepliedEvent
  | ConversationClosedEvent
  | ConversationOpenedEvent
  | ContactCreatedEvent
  | ContactUpdatedEvent
  | ContactDeletedEvent
  | ContactTagCreatedEvent
  | ContactTagDeletedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Hub-Signature': string
  payload: string
}

/**
 * Intercom Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class IntercomWebhookHandler {
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
    return this.secureCompare(options['X-Hub-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Hub-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Hub-Signature': signature, payload })) {
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
   * Register handler for conversation.admin.replied events
   * @param handler - Event handler function
   */
  onConversationAdminReplied(handler: (event: ConversationAdminRepliedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_ADMIN_REPLIED, handler as any)
  }

  /**
   * Register handler for conversation.user.replied events
   * @param handler - Event handler function
   */
  onConversationUserReplied(handler: (event: ConversationUserRepliedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_USER_REPLIED, handler as any)
  }

  /**
   * Register handler for conversation.closed events
   * @param handler - Event handler function
   */
  onConversationClosed(handler: (event: ConversationClosedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_CLOSED, handler as any)
  }

  /**
   * Register handler for conversation.opened events
   * @param handler - Event handler function
   */
  onConversationOpened(handler: (event: ConversationOpenedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_OPENED, handler as any)
  }

  /**
   * Register handler for contact.created events
   * @param handler - Event handler function
   */
  onContactCreated(handler: (event: ContactCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_CREATED, handler as any)
  }

  /**
   * Register handler for contact.updated events
   * @param handler - Event handler function
   */
  onContactUpdated(handler: (event: ContactUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_UPDATED, handler as any)
  }

  /**
   * Register handler for contact.deleted events
   * @param handler - Event handler function
   */
  onContactDeleted(handler: (event: ContactDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_DELETED, handler as any)
  }

  /**
   * Register handler for contact.tag.created events
   * @param handler - Event handler function
   */
  onContactTagCreated(handler: (event: ContactTagCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_TAG_CREATED, handler as any)
  }

  /**
   * Register handler for contact.tag.deleted events
   * @param handler - Event handler function
   */
  onContactTagDeleted(handler: (event: ContactTagDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_TAG_DELETED, handler as any)
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
