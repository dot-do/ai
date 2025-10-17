/**
 * Braintree Webhooks
 *
 * Auto-generated webhook handling for Braintree Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/braintree
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  SUBSCRIPTION_CHARGED_SUCCESSFULLY: 'subscription_charged_successfully',
  SUBSCRIPTION_CHARGED_UNSUCCESSFULLY: 'subscription_charged_unsuccessfully',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  SUBSCRIPTION_EXPIRED: 'subscription_expired',
  SUBSCRIPTION_WENT_ACTIVE: 'subscription_went_active',
  SUBSCRIPTION_WENT_PAST_DUE: 'subscription_went_past_due',
  TRANSACTION_SETTLED: 'transaction_settled',
  TRANSACTION_SETTLEMENT_DECLINED: 'transaction_settlement_declined',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface SubscriptionChargedSuccessfullyEvent {
  type: 'subscription_charged_successfully'
  data: any
  timestamp: string
  id: string
}

export interface SubscriptionChargedUnsuccessfullyEvent {
  type: 'subscription_charged_unsuccessfully'
  data: any
  timestamp: string
  id: string
}

export interface SubscriptionCanceledEvent {
  type: 'subscription_canceled'
  data: any
  timestamp: string
  id: string
}

export interface SubscriptionExpiredEvent {
  type: 'subscription_expired'
  data: any
  timestamp: string
  id: string
}

export interface SubscriptionWentActiveEvent {
  type: 'subscription_went_active'
  data: any
  timestamp: string
  id: string
}

export interface SubscriptionWentPastDueEvent {
  type: 'subscription_went_past_due'
  data: any
  timestamp: string
  id: string
}

export interface TransactionSettledEvent {
  type: 'transaction_settled'
  data: any
  timestamp: string
  id: string
}

export interface TransactionSettlementDeclinedEvent {
  type: 'transaction_settlement_declined'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | SubscriptionChargedSuccessfullyEvent
  | SubscriptionChargedUnsuccessfullyEvent
  | SubscriptionCanceledEvent
  | SubscriptionExpiredEvent
  | SubscriptionWentActiveEvent
  | SubscriptionWentPastDueEvent
  | TransactionSettledEvent
  | TransactionSettlementDeclinedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  bt_signature: string
  payload: string
}

/**
 * Braintree Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class BraintreeWebhookHandler {
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
    return this.secureCompare(options.bt_signature, expectedSignature)
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
    const signature = request.headers.get('bt_signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, bt_signature: signature, payload })) {
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
   * Register handler for subscription.charged_successfully events
   * @param handler - Event handler function
   */
  onSubscriptionChargedSuccessfully(handler: (event: SubscriptionChargedSuccessfullyEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_CHARGED_SUCCESSFULLY, handler as any)
  }

  /**
   * Register handler for subscription.charged_unsuccessfully events
   * @param handler - Event handler function
   */
  onSubscriptionChargedUnsuccessfully(handler: (event: SubscriptionChargedUnsuccessfullyEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_CHARGED_UNSUCCESSFULLY, handler as any)
  }

  /**
   * Register handler for subscription.canceled events
   * @param handler - Event handler function
   */
  onSubscriptionCanceled(handler: (event: SubscriptionCanceledEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_CANCELED, handler as any)
  }

  /**
   * Register handler for subscription.expired events
   * @param handler - Event handler function
   */
  onSubscriptionExpired(handler: (event: SubscriptionExpiredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_EXPIRED, handler as any)
  }

  /**
   * Register handler for subscription.went_active events
   * @param handler - Event handler function
   */
  onSubscriptionWentActive(handler: (event: SubscriptionWentActiveEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_WENT_ACTIVE, handler as any)
  }

  /**
   * Register handler for subscription.went_past_due events
   * @param handler - Event handler function
   */
  onSubscriptionWentPastDue(handler: (event: SubscriptionWentPastDueEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_WENT_PAST_DUE, handler as any)
  }

  /**
   * Register handler for transaction.settled events
   * @param handler - Event handler function
   */
  onTransactionSettled(handler: (event: TransactionSettledEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TRANSACTION_SETTLED, handler as any)
  }

  /**
   * Register handler for transaction.settlement_declined events
   * @param handler - Event handler function
   */
  onTransactionSettlementDeclined(handler: (event: TransactionSettlementDeclinedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TRANSACTION_SETTLEMENT_DECLINED, handler as any)
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
