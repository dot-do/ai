/**
 * Square Webhooks
 *
 * Auto-generated webhook handling for Square Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/square
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_UPDATED: 'payment.updated',
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  INVOICE_PUBLISHED: 'invoice.published',
  INVOICE_PAYMENT_MADE: 'invoice.payment_made',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface PaymentCreatedEvent {
  type: 'payment.created'
  data: any
  timestamp: string
  id: string
}

export interface PaymentUpdatedEvent {
  type: 'payment.updated'
  data: any
  timestamp: string
  id: string
}

export interface OrderCreatedEvent {
  type: 'order.created'
  data: any
  timestamp: string
  id: string
}

export interface OrderUpdatedEvent {
  type: 'order.updated'
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

export interface InvoicePublishedEvent {
  type: 'invoice.published'
  data: any
  timestamp: string
  id: string
}

export interface InvoicePaymentMadeEvent {
  type: 'invoice.payment_made'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | PaymentCreatedEvent
  | PaymentUpdatedEvent
  | OrderCreatedEvent
  | OrderUpdatedEvent
  | CustomerCreatedEvent
  | CustomerUpdatedEvent
  | InvoicePublishedEvent
  | InvoicePaymentMadeEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Square-Hmacsha256-Signature': string
  payload: string
}

/**
 * Square Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class SquareWebhookHandler {
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
    return this.secureCompare(options['X-Square-Hmacsha256-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Square-Hmacsha256-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Square-Hmacsha256-Signature': signature, payload })) {
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
   * Register handler for payment.created events
   * @param handler - Event handler function
   */
  onPaymentCreated(handler: (event: PaymentCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_CREATED, handler as any)
  }

  /**
   * Register handler for payment.updated events
   * @param handler - Event handler function
   */
  onPaymentUpdated(handler: (event: PaymentUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_UPDATED, handler as any)
  }

  /**
   * Register handler for order.created events
   * @param handler - Event handler function
   */
  onOrderCreated(handler: (event: OrderCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ORDER_CREATED, handler as any)
  }

  /**
   * Register handler for order.updated events
   * @param handler - Event handler function
   */
  onOrderUpdated(handler: (event: OrderUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ORDER_UPDATED, handler as any)
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
   * Register handler for invoice.published events
   * @param handler - Event handler function
   */
  onInvoicePublished(handler: (event: InvoicePublishedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.INVOICE_PUBLISHED, handler as any)
  }

  /**
   * Register handler for invoice.payment_made events
   * @param handler - Event handler function
   */
  onInvoicePaymentMade(handler: (event: InvoicePaymentMadeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.INVOICE_PAYMENT_MADE, handler as any)
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
