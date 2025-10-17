/**
 * Sentry Webhooks
 *
 * Auto-generated webhook handling for Sentry Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sentry
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  ERROR_CREATED: 'error.created',
  ISSUE_CREATED: 'issue.created',
  ISSUE_RESOLVED: 'issue.resolved',
  ISSUE_IGNORED: 'issue.ignored',
  ISSUE_ASSIGNED: 'issue.assigned',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface ErrorCreatedEvent {
  type: 'error.created'
  data: any
  timestamp: string
  id: string
}

export interface IssueCreatedEvent {
  type: 'issue.created'
  data: any
  timestamp: string
  id: string
}

export interface IssueResolvedEvent {
  type: 'issue.resolved'
  data: any
  timestamp: string
  id: string
}

export interface IssueIgnoredEvent {
  type: 'issue.ignored'
  data: any
  timestamp: string
  id: string
}

export interface IssueAssignedEvent {
  type: 'issue.assigned'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = ErrorCreatedEvent | IssueCreatedEvent | IssueResolvedEvent | IssueIgnoredEvent | IssueAssignedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'Sentry-Hook-Signature': string
  payload: string
}

/**
 * Sentry Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class SentryWebhookHandler {
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
    return this.secureCompare(options['Sentry-Hook-Signature'], expectedSignature)
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
    const signature = request.headers.get('Sentry-Hook-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'Sentry-Hook-Signature': signature, payload })) {
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
   * Register handler for error.created events
   * @param handler - Event handler function
   */
  onErrorCreated(handler: (event: ErrorCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ERROR_CREATED, handler as any)
  }

  /**
   * Register handler for issue.created events
   * @param handler - Event handler function
   */
  onIssueCreated(handler: (event: IssueCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_CREATED, handler as any)
  }

  /**
   * Register handler for issue.resolved events
   * @param handler - Event handler function
   */
  onIssueResolved(handler: (event: IssueResolvedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_RESOLVED, handler as any)
  }

  /**
   * Register handler for issue.ignored events
   * @param handler - Event handler function
   */
  onIssueIgnored(handler: (event: IssueIgnoredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_IGNORED, handler as any)
  }

  /**
   * Register handler for issue.assigned events
   * @param handler - Event handler function
   */
  onIssueAssigned(handler: (event: IssueAssignedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_ASSIGNED, handler as any)
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
