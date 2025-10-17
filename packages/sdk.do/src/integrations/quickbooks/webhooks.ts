/**
 * QuickBooks Webhooks
 *
 * Auto-generated webhook handling for QuickBooks Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/quickbooks
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  CUSTOMER_CREATE: 'Customer.Create',
  CUSTOMER_UPDATE: 'Customer.Update',
  CUSTOMER_DELETE: 'Customer.Delete',
  INVOICE_CREATE: 'Invoice.Create',
  INVOICE_UPDATE: 'Invoice.Update',
  INVOICE_DELETE: 'Invoice.Delete',
  PAYMENT_CREATE: 'Payment.Create',
  PAYMENT_UPDATE: 'Payment.Update',
  PAYMENT_DELETE: 'Payment.Delete',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface CustomerCreateEvent {
  type: 'Customer.Create'
  data: any
  timestamp: string
  id: string
}

export interface CustomerUpdateEvent {
  type: 'Customer.Update'
  data: any
  timestamp: string
  id: string
}

export interface CustomerDeleteEvent {
  type: 'Customer.Delete'
  data: any
  timestamp: string
  id: string
}

export interface InvoiceCreateEvent {
  type: 'Invoice.Create'
  data: any
  timestamp: string
  id: string
}

export interface InvoiceUpdateEvent {
  type: 'Invoice.Update'
  data: any
  timestamp: string
  id: string
}

export interface InvoiceDeleteEvent {
  type: 'Invoice.Delete'
  data: any
  timestamp: string
  id: string
}

export interface PaymentCreateEvent {
  type: 'Payment.Create'
  data: any
  timestamp: string
  id: string
}

export interface PaymentUpdateEvent {
  type: 'Payment.Update'
  data: any
  timestamp: string
  id: string
}

export interface PaymentDeleteEvent {
  type: 'Payment.Delete'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | CustomerCreateEvent
  | CustomerUpdateEvent
  | CustomerDeleteEvent
  | InvoiceCreateEvent
  | InvoiceUpdateEvent
  | InvoiceDeleteEvent
  | PaymentCreateEvent
  | PaymentUpdateEvent
  | PaymentDeleteEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'intuit-signature': string
  payload: string
}

/**
 * QuickBooks Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class QuickbooksWebhookHandler {
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
    return this.secureCompare(options['intuit-signature'], expectedSignature)
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
    const signature = request.headers.get('intuit-signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'intuit-signature': signature, payload })) {
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
   * Register handler for customer.create events
   * @param handler - Event handler function
   */
  onCustomerCreate(handler: (event: CustomerCreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CUSTOMER_CREATE, handler as any)
  }

  /**
   * Register handler for customer.update events
   * @param handler - Event handler function
   */
  onCustomerUpdate(handler: (event: CustomerUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CUSTOMER_UPDATE, handler as any)
  }

  /**
   * Register handler for customer.delete events
   * @param handler - Event handler function
   */
  onCustomerDelete(handler: (event: CustomerDeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CUSTOMER_DELETE, handler as any)
  }

  /**
   * Register handler for invoice.create events
   * @param handler - Event handler function
   */
  onInvoiceCreate(handler: (event: InvoiceCreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.INVOICE_CREATE, handler as any)
  }

  /**
   * Register handler for invoice.update events
   * @param handler - Event handler function
   */
  onInvoiceUpdate(handler: (event: InvoiceUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.INVOICE_UPDATE, handler as any)
  }

  /**
   * Register handler for invoice.delete events
   * @param handler - Event handler function
   */
  onInvoiceDelete(handler: (event: InvoiceDeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.INVOICE_DELETE, handler as any)
  }

  /**
   * Register handler for payment.create events
   * @param handler - Event handler function
   */
  onPaymentCreate(handler: (event: PaymentCreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_CREATE, handler as any)
  }

  /**
   * Register handler for payment.update events
   * @param handler - Event handler function
   */
  onPaymentUpdate(handler: (event: PaymentUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_UPDATE, handler as any)
  }

  /**
   * Register handler for payment.delete events
   * @param handler - Event handler function
   */
  onPaymentDelete(handler: (event: PaymentDeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PAYMENT_DELETE, handler as any)
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
