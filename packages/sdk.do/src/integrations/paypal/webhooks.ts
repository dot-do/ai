/**
 * PayPal Webhooks
 *
 * Auto-generated webhook handling for PayPal Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/paypal
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  PAYMENT_CAPTURE_COMPLETED: 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_CAPTURE_DENIED: 'PAYMENT.CAPTURE.DENIED',
  PAYMENT_CAPTURE_REFUNDED: 'PAYMENT.CAPTURE.REFUNDED',
  CHECKOUT_ORDER_APPROVED: 'CHECKOUT.ORDER.APPROVED',
  CHECKOUT_ORDER_COMPLETED: 'CHECKOUT.ORDER.COMPLETED',
  BILLING_SUBSCRIPTION_CREATED: 'BILLING.SUBSCRIPTION.CREATED',
  BILLING_SUBSCRIPTION_ACTIVATED: 'BILLING.SUBSCRIPTION.ACTIVATED',
  BILLING_SUBSCRIPTION_CANCELLED: 'BILLING.SUBSCRIPTION.CANCELLED',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface PaymentCaptureCompletedEvent {
  type: 'PAYMENT.CAPTURE.COMPLETED'
  data: any
  timestamp: string
  id: string
}

export interface PaymentCaptureDeniedEvent {
  type: 'PAYMENT.CAPTURE.DENIED'
  data: any
  timestamp: string
  id: string
}

export interface PaymentCaptureRefundedEvent {
  type: 'PAYMENT.CAPTURE.REFUNDED'
  data: any
  timestamp: string
  id: string
}

export interface CheckoutOrderApprovedEvent {
  type: 'CHECKOUT.ORDER.APPROVED'
  data: any
  timestamp: string
  id: string
}

export interface CheckoutOrderCompletedEvent {
  type: 'CHECKOUT.ORDER.COMPLETED'
  data: any
  timestamp: string
  id: string
}

export interface BillingSubscriptionCreatedEvent {
  type: 'BILLING.SUBSCRIPTION.CREATED'
  data: any
  timestamp: string
  id: string
}

export interface BillingSubscriptionActivatedEvent {
  type: 'BILLING.SUBSCRIPTION.ACTIVATED'
  data: any
  timestamp: string
  id: string
}

export interface BillingSubscriptionCancelledEvent {
  type: 'BILLING.SUBSCRIPTION.CANCELLED'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | PaymentCaptureCompletedEvent
  | PaymentCaptureDeniedEvent
  | PaymentCaptureRefundedEvent
  | CheckoutOrderApprovedEvent
  | CheckoutOrderCompletedEvent
  | BillingSubscriptionCreatedEvent
  | BillingSubscriptionActivatedEvent
  | BillingSubscriptionCancelledEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'PAYPAL-TRANSMISSION-SIG': string
  payload: string
}

/**
 * PayPal Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class PaypalWebhookHandler {
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
    return this.secureCompare(options['PAYPAL-TRANSMISSION-SIG'], expectedSignature)
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
    const signature = request.headers.get('PAYPAL-TRANSMISSION-SIG')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'PAYPAL-TRANSMISSION-SIG': signature, payload })) {
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
   * Register handler for payment.capture.completed events
   * @param handler - Event handler function
   */
  onPaymentCaptureCompleted(handler: (event: PaymentCaptureCompletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_CAPTURE_COMPLETED, handler as any)
  }

  /**
   * Register handler for payment.capture.denied events
   * @param handler - Event handler function
   */
  onPaymentCaptureDenied(handler: (event: PaymentCaptureDeniedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_CAPTURE_DENIED, handler as any)
  }

  /**
   * Register handler for payment.capture.refunded events
   * @param handler - Event handler function
   */
  onPaymentCaptureRefunded(handler: (event: PaymentCaptureRefundedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_CAPTURE_REFUNDED, handler as any)
  }

  /**
   * Register handler for checkout.order.approved events
   * @param handler - Event handler function
   */
  onCheckoutOrderApproved(handler: (event: CheckoutOrderApprovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHECKOUT_ORDER_APPROVED, handler as any)
  }

  /**
   * Register handler for checkout.order.completed events
   * @param handler - Event handler function
   */
  onCheckoutOrderCompleted(handler: (event: CheckoutOrderCompletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHECKOUT_ORDER_COMPLETED, handler as any)
  }

  /**
   * Register handler for billing.subscription.created events
   * @param handler - Event handler function
   */
  onBillingSubscriptionCreated(handler: (event: BillingSubscriptionCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BILLING_SUBSCRIPTION_CREATED, handler as any)
  }

  /**
   * Register handler for billing.subscription.activated events
   * @param handler - Event handler function
   */
  onBillingSubscriptionActivated(handler: (event: BillingSubscriptionActivatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BILLING_SUBSCRIPTION_ACTIVATED, handler as any)
  }

  /**
   * Register handler for billing.subscription.cancelled events
   * @param handler - Event handler function
   */
  onBillingSubscriptionCancelled(handler: (event: BillingSubscriptionCancelledEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BILLING_SUBSCRIPTION_CANCELLED, handler as any)
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
