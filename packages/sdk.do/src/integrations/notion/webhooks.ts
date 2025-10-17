/**
 * Notion Webhooks
 *
 * Auto-generated webhook handling for Notion Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/notion
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  PAGE_CREATED: 'page.created',
  PAGE_UPDATED: 'page.updated',
  PAGE_DELETED: 'page.deleted',
  DATABASE_CREATED: 'database.created',
  DATABASE_UPDATED: 'database.updated',
  DATABASE_DELETED: 'database.deleted',
  BLOCK_CREATED: 'block.created',
  BLOCK_UPDATED: 'block.updated',
  BLOCK_DELETED: 'block.deleted',
  COMMENT_CREATED: 'comment.created',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface PageCreatedEvent {
  type: 'page.created'
  data: any
  timestamp: string
  id: string
}

export interface PageUpdatedEvent {
  type: 'page.updated'
  data: any
  timestamp: string
  id: string
}

export interface PageDeletedEvent {
  type: 'page.deleted'
  data: any
  timestamp: string
  id: string
}

export interface DatabaseCreatedEvent {
  type: 'database.created'
  data: any
  timestamp: string
  id: string
}

export interface DatabaseUpdatedEvent {
  type: 'database.updated'
  data: any
  timestamp: string
  id: string
}

export interface DatabaseDeletedEvent {
  type: 'database.deleted'
  data: any
  timestamp: string
  id: string
}

export interface BlockCreatedEvent {
  type: 'block.created'
  data: any
  timestamp: string
  id: string
}

export interface BlockUpdatedEvent {
  type: 'block.updated'
  data: any
  timestamp: string
  id: string
}

export interface BlockDeletedEvent {
  type: 'block.deleted'
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
  | PageCreatedEvent
  | PageUpdatedEvent
  | PageDeletedEvent
  | DatabaseCreatedEvent
  | DatabaseUpdatedEvent
  | DatabaseDeletedEvent
  | BlockCreatedEvent
  | BlockUpdatedEvent
  | BlockDeletedEvent
  | CommentCreatedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'Notion-Signature': string
  payload: string
}

/**
 * Notion Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class NotionWebhookHandler {
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
    return this.secureCompare(options['Notion-Signature'], expectedSignature)
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
    const signature = request.headers.get('Notion-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'Notion-Signature': signature, payload })) {
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
   * Register handler for page.created events
   * @param handler - Event handler function
   */
  onPageCreated(handler: (event: PageCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAGE_CREATED, handler as any)
  }

  /**
   * Register handler for page.updated events
   * @param handler - Event handler function
   */
  onPageUpdated(handler: (event: PageUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAGE_UPDATED, handler as any)
  }

  /**
   * Register handler for page.deleted events
   * @param handler - Event handler function
   */
  onPageDeleted(handler: (event: PageDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAGE_DELETED, handler as any)
  }

  /**
   * Register handler for database.created events
   * @param handler - Event handler function
   */
  onDatabaseCreated(handler: (event: DatabaseCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DATABASE_CREATED, handler as any)
  }

  /**
   * Register handler for database.updated events
   * @param handler - Event handler function
   */
  onDatabaseUpdated(handler: (event: DatabaseUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DATABASE_UPDATED, handler as any)
  }

  /**
   * Register handler for database.deleted events
   * @param handler - Event handler function
   */
  onDatabaseDeleted(handler: (event: DatabaseDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DATABASE_DELETED, handler as any)
  }

  /**
   * Register handler for block.created events
   * @param handler - Event handler function
   */
  onBlockCreated(handler: (event: BlockCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BLOCK_CREATED, handler as any)
  }

  /**
   * Register handler for block.updated events
   * @param handler - Event handler function
   */
  onBlockUpdated(handler: (event: BlockUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BLOCK_UPDATED, handler as any)
  }

  /**
   * Register handler for block.deleted events
   * @param handler - Event handler function
   */
  onBlockDeleted(handler: (event: BlockDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BLOCK_DELETED, handler as any)
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
