/**
 * Stripe Webhooks
 *
 * Auto-generated webhook handling for Stripe Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/stripe
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_DELETED: 'customer.deleted',
  PAYMENT_INTENT_CREATED: 'payment_intent.created',
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
  PAYMENT_INTENT_CANCELED: 'payment_intent.canceled',
  CHARGE_SUCCEEDED: 'charge.succeeded',
  CHARGE_FAILED: 'charge.failed',
  CHARGE_REFUNDED: 'charge.refunded',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_DELETED: 'subscription.deleted',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
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

export interface CustomerDeletedEvent {
  type: 'customer.deleted'
  data: any
  timestamp: string
  id: string
}

export interface PaymentIntentCreatedEvent {
  type: 'payment_intent.created'
  data: any
  timestamp: string
  id: string
}

export interface PaymentIntentSucceededEvent {
  type: 'payment_intent.succeeded'
  data: any
  timestamp: string
  id: string
}

export interface PaymentIntentPaymentFailedEvent {
  type: 'payment_intent.payment_failed'
  data: any
  timestamp: string
  id: string
}

export interface PaymentIntentCanceledEvent {
  type: 'payment_intent.canceled'
  data: any
  timestamp: string
  id: string
}

export interface ChargeSucceededEvent {
  type: 'charge.succeeded'
  data: any
  timestamp: string
  id: string
}

export interface ChargeFailedEvent {
  type: 'charge.failed'
  data: any
  timestamp: string
  id: string
}

export interface ChargeRefundedEvent {
  type: 'charge.refunded'
  data: any
  timestamp: string
  id: string
}

export interface SubscriptionCreatedEvent {
  type: 'subscription.created'
  data: any
  timestamp: string
  id: string
}

export interface SubscriptionUpdatedEvent {
  type: 'subscription.updated'
  data: any
  timestamp: string
  id: string
}

export interface SubscriptionDeletedEvent {
  type: 'subscription.deleted'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | CustomerCreatedEvent
  | CustomerUpdatedEvent
  | CustomerDeletedEvent
  | PaymentIntentCreatedEvent
  | PaymentIntentSucceededEvent
  | PaymentIntentPaymentFailedEvent
  | PaymentIntentCanceledEvent
  | ChargeSucceededEvent
  | ChargeFailedEvent
  | ChargeRefundedEvent
  | SubscriptionCreatedEvent
  | SubscriptionUpdatedEvent
  | SubscriptionDeletedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'Stripe-Signature': string
  payload: string
}

/**
 * Stripe Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class StripeWebhookHandler {
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
    return this.secureCompare(options['Stripe-Signature'], expectedSignature)
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
    const signature = request.headers.get('Stripe-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'Stripe-Signature': signature, payload })) {
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
   * Register handler for customer.deleted events
   * @param handler - Event handler function
   */
  onCustomerDeleted(handler: (event: CustomerDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CUSTOMER_DELETED, handler as any)
  }

  /**
   * Register handler for payment_intent.created events
   * @param handler - Event handler function
   */
  onPaymentIntentCreated(handler: (event: PaymentIntentCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_INTENT_CREATED, handler as any)
  }

  /**
   * Register handler for payment_intent.succeeded events
   * @param handler - Event handler function
   */
  onPaymentIntentSucceeded(handler: (event: PaymentIntentSucceededEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_INTENT_SUCCEEDED, handler as any)
  }

  /**
   * Register handler for payment_intent.payment_failed events
   * @param handler - Event handler function
   */
  onPaymentIntentPaymentFailed(handler: (event: PaymentIntentPaymentFailedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_INTENT_PAYMENT_FAILED, handler as any)
  }

  /**
   * Register handler for payment_intent.canceled events
   * @param handler - Event handler function
   */
  onPaymentIntentCanceled(handler: (event: PaymentIntentCanceledEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_INTENT_CANCELED, handler as any)
  }

  /**
   * Register handler for charge.succeeded events
   * @param handler - Event handler function
   */
  onChargeSucceeded(handler: (event: ChargeSucceededEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHARGE_SUCCEEDED, handler as any)
  }

  /**
   * Register handler for charge.failed events
   * @param handler - Event handler function
   */
  onChargeFailed(handler: (event: ChargeFailedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHARGE_FAILED, handler as any)
  }

  /**
   * Register handler for charge.refunded events
   * @param handler - Event handler function
   */
  onChargeRefunded(handler: (event: ChargeRefundedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHARGE_REFUNDED, handler as any)
  }

  /**
   * Register handler for subscription.created events
   * @param handler - Event handler function
   */
  onSubscriptionCreated(handler: (event: SubscriptionCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_CREATED, handler as any)
  }

  /**
   * Register handler for subscription.updated events
   * @param handler - Event handler function
   */
  onSubscriptionUpdated(handler: (event: SubscriptionUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED, handler as any)
  }

  /**
   * Register handler for subscription.deleted events
   * @param handler - Event handler function
   */
  onSubscriptionDeleted(handler: (event: SubscriptionDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SUBSCRIPTION_DELETED, handler as any)
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
