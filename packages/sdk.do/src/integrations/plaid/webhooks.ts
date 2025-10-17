/**
 * Plaid Webhooks
 *
 * Auto-generated webhook handling for Plaid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/plaid
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  TRANSACTIONS_DEFAULT_UPDATE: 'TRANSACTIONS_DEFAULT_UPDATE',
  TRANSACTIONS_REMOVED: 'TRANSACTIONS_REMOVED',
  ITEM_ERROR: 'ITEM_ERROR',
  ITEM_LOGIN_REQUIRED: 'ITEM_LOGIN_REQUIRED',
  ITEM_PENDING_EXPIRATION: 'ITEM_PENDING_EXPIRATION',
  ITEM_WEBHOOK_UPDATE_ACKNOWLEDGED: 'ITEM_WEBHOOK_UPDATE_ACKNOWLEDGED',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface TransactionsDefaultUpdateEvent {
  type: 'TRANSACTIONS_DEFAULT_UPDATE'
  data: any
  timestamp: string
  id: string
}

export interface TransactionsRemovedEvent {
  type: 'TRANSACTIONS_REMOVED'
  data: any
  timestamp: string
  id: string
}

export interface ItemErrorEvent {
  type: 'ITEM_ERROR'
  data: any
  timestamp: string
  id: string
}

export interface ItemLoginRequiredEvent {
  type: 'ITEM_LOGIN_REQUIRED'
  data: any
  timestamp: string
  id: string
}

export interface ItemPendingExpirationEvent {
  type: 'ITEM_PENDING_EXPIRATION'
  data: any
  timestamp: string
  id: string
}

export interface ItemWebhookUpdateAcknowledgedEvent {
  type: 'ITEM_WEBHOOK_UPDATE_ACKNOWLEDGED'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | TransactionsDefaultUpdateEvent
  | TransactionsRemovedEvent
  | ItemErrorEvent
  | ItemLoginRequiredEvent
  | ItemPendingExpirationEvent
  | ItemWebhookUpdateAcknowledgedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'Plaid-Verification': string
  payload: string
}

/**
 * Plaid Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class PlaidWebhookHandler {
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
    return this.secureCompare(options['Plaid-Verification'], expectedSignature)
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
    const signature = request.headers.get('Plaid-Verification')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'Plaid-Verification': signature, payload })) {
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
   * Register handler for transactions.default_update events
   * @param handler - Event handler function
   */
  onTransactionsDefaultUpdate(handler: (event: TransactionsDefaultUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TRANSACTIONS_DEFAULT_UPDATE, handler as any)
  }

  /**
   * Register handler for transactions.removed events
   * @param handler - Event handler function
   */
  onTransactionsRemoved(handler: (event: TransactionsRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TRANSACTIONS_REMOVED, handler as any)
  }

  /**
   * Register handler for item.error events
   * @param handler - Event handler function
   */
  onItemError(handler: (event: ItemErrorEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ITEM_ERROR, handler as any)
  }

  /**
   * Register handler for item.login_required events
   * @param handler - Event handler function
   */
  onItemLoginRequired(handler: (event: ItemLoginRequiredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ITEM_LOGIN_REQUIRED, handler as any)
  }

  /**
   * Register handler for item.pending_expiration events
   * @param handler - Event handler function
   */
  onItemPendingExpiration(handler: (event: ItemPendingExpirationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ITEM_PENDING_EXPIRATION, handler as any)
  }

  /**
   * Register handler for item.webhook_update_acknowledged events
   * @param handler - Event handler function
   */
  onItemWebhookUpdateAcknowledged(handler: (event: ItemWebhookUpdateAcknowledgedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ITEM_WEBHOOK_UPDATE_ACKNOWLEDGED, handler as any)
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
