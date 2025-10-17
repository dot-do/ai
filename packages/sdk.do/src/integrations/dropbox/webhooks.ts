/**
 * Dropbox Webhooks
 *
 * Auto-generated webhook handling for Dropbox Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dropbox
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  FILE_CREATED: 'file_created',
  FILE_UPDATED: 'file_updated',
  FILE_DELETED: 'file_deleted',
  FOLDER_CREATED: 'folder_created',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface FileCreatedEvent {
  type: 'file_created'
  data: any
  timestamp: string
  id: string
}

export interface FileUpdatedEvent {
  type: 'file_updated'
  data: any
  timestamp: string
  id: string
}

export interface FileDeletedEvent {
  type: 'file_deleted'
  data: any
  timestamp: string
  id: string
}

export interface FolderCreatedEvent {
  type: 'folder_created'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = FileCreatedEvent | FileUpdatedEvent | FileDeletedEvent | FolderCreatedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Dropbox-Signature': string
  payload: string
}

/**
 * Dropbox Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class DropboxWebhookHandler {
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
    return this.secureCompare(options['X-Dropbox-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Dropbox-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Dropbox-Signature': signature, payload })) {
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
   * Register handler for file_created events
   * @param handler - Event handler function
   */
  onFileCreated(handler: (event: FileCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_CREATED, handler as any)
  }

  /**
   * Register handler for file_updated events
   * @param handler - Event handler function
   */
  onFileUpdated(handler: (event: FileUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_UPDATED, handler as any)
  }

  /**
   * Register handler for file_deleted events
   * @param handler - Event handler function
   */
  onFileDeleted(handler: (event: FileDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_DELETED, handler as any)
  }

  /**
   * Register handler for folder_created events
   * @param handler - Event handler function
   */
  onFolderCreated(handler: (event: FolderCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FOLDER_CREATED, handler as any)
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
