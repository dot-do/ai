/**
 * Front Webhooks
 *
 * Auto-generated webhook handling for Front Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/front
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  CONVERSATION_CREATED: 'conversation.created',
  CONVERSATION_UPDATED: 'conversation.updated',
  CONVERSATION_ARCHIVED: 'conversation.archived',
  CONVERSATION_ASSIGNED: 'conversation.assigned',
  CONVERSATION_TAG_ADDED: 'conversation.tag.added',
  CONVERSATION_TAG_REMOVED: 'conversation.tag.removed',
  MESSAGE_RECEIVED: 'message.received',
  MESSAGE_SENT: 'message.sent',
  COMMENT_CREATED: 'comment.created',
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

export interface ConversationUpdatedEvent {
  type: 'conversation.updated'
  data: any
  timestamp: string
  id: string
}

export interface ConversationArchivedEvent {
  type: 'conversation.archived'
  data: any
  timestamp: string
  id: string
}

export interface ConversationAssignedEvent {
  type: 'conversation.assigned'
  data: any
  timestamp: string
  id: string
}

export interface ConversationTagAddedEvent {
  type: 'conversation.tag.added'
  data: any
  timestamp: string
  id: string
}

export interface ConversationTagRemovedEvent {
  type: 'conversation.tag.removed'
  data: any
  timestamp: string
  id: string
}

export interface MessageReceivedEvent {
  type: 'message.received'
  data: any
  timestamp: string
  id: string
}

export interface MessageSentEvent {
  type: 'message.sent'
  data: any
  timestamp: string
  id: string
}

export interface CommentCreatedEvent {
  type: 'comment.created'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | ConversationCreatedEvent
  | ConversationUpdatedEvent
  | ConversationArchivedEvent
  | ConversationAssignedEvent
  | ConversationTagAddedEvent
  | ConversationTagRemovedEvent
  | MessageReceivedEvent
  | MessageSentEvent
  | CommentCreatedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Front-Signature': string
  payload: string
}

/**
 * Front Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class FrontWebhookHandler {
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
    return this.secureCompare(options['X-Front-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Front-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Front-Signature': signature, payload })) {
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
   * Register handler for conversation.archived events
   * @param handler - Event handler function
   */
  onConversationArchived(handler: (event: ConversationArchivedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_ARCHIVED, handler as any)
  }

  /**
   * Register handler for conversation.assigned events
   * @param handler - Event handler function
   */
  onConversationAssigned(handler: (event: ConversationAssignedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_ASSIGNED, handler as any)
  }

  /**
   * Register handler for conversation.tag.added events
   * @param handler - Event handler function
   */
  onConversationTagAdded(handler: (event: ConversationTagAddedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_TAG_ADDED, handler as any)
  }

  /**
   * Register handler for conversation.tag.removed events
   * @param handler - Event handler function
   */
  onConversationTagRemoved(handler: (event: ConversationTagRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_TAG_REMOVED, handler as any)
  }

  /**
   * Register handler for message.received events
   * @param handler - Event handler function
   */
  onMessageReceived(handler: (event: MessageReceivedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_RECEIVED, handler as any)
  }

  /**
   * Register handler for message.sent events
   * @param handler - Event handler function
   */
  onMessageSent(handler: (event: MessageSentEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_SENT, handler as any)
  }

  /**
   * Register handler for comment.created events
   * @param handler - Event handler function
   */
  onCommentCreated(handler: (event: CommentCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMMENT_CREATED, handler as any)
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
