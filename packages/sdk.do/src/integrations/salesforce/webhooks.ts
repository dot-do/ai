/**
 * Salesforce Webhooks
 *
 * Auto-generated webhook handling for Salesforce Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/salesforce
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  ACCOUNT_CREATED: 'Account:created',
  ACCOUNT_UPDATED: 'Account:updated',
  ACCOUNT_DELETED: 'Account:deleted',
  CONTACT_CREATED: 'Contact:created',
  CONTACT_UPDATED: 'Contact:updated',
  CONTACT_DELETED: 'Contact:deleted',
  LEAD_CREATED: 'Lead:created',
  LEAD_UPDATED: 'Lead:updated',
  LEAD_DELETED: 'Lead:deleted',
  LEAD_CONVERTED: 'Lead:converted',
  OPPORTUNITY_CREATED: 'Opportunity:created',
  OPPORTUNITY_UPDATED: 'Opportunity:updated',
  OPPORTUNITY_DELETED: 'Opportunity:deleted',
  CASE_CREATED: 'Case:created',
  CASE_UPDATED: 'Case:updated',
  CASE_DELETED: 'Case:deleted',
  TASK_CREATED: 'Task:created',
  TASK_UPDATED: 'Task:updated',
  TASK_DELETED: 'Task:deleted',
  PLATFORM_EVENT: 'platform_event',
  CHANGE_DATA_CAPTURE: 'change_data_capture',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface AccountCreatedEvent {
  type: 'Account:created'
  data: any
  timestamp: string
  id: string
}

export interface AccountUpdatedEvent {
  type: 'Account:updated'
  data: any
  timestamp: string
  id: string
}

export interface AccountDeletedEvent {
  type: 'Account:deleted'
  data: any
  timestamp: string
  id: string
}

export interface ContactCreatedEvent {
  type: 'Contact:created'
  data: any
  timestamp: string
  id: string
}

export interface ContactUpdatedEvent {
  type: 'Contact:updated'
  data: any
  timestamp: string
  id: string
}

export interface ContactDeletedEvent {
  type: 'Contact:deleted'
  data: any
  timestamp: string
  id: string
}

export interface LeadCreatedEvent {
  type: 'Lead:created'
  data: any
  timestamp: string
  id: string
}

export interface LeadUpdatedEvent {
  type: 'Lead:updated'
  data: any
  timestamp: string
  id: string
}

export interface LeadDeletedEvent {
  type: 'Lead:deleted'
  data: any
  timestamp: string
  id: string
}

export interface LeadConvertedEvent {
  type: 'Lead:converted'
  data: any
  timestamp: string
  id: string
}

export interface OpportunityCreatedEvent {
  type: 'Opportunity:created'
  data: any
  timestamp: string
  id: string
}

export interface OpportunityUpdatedEvent {
  type: 'Opportunity:updated'
  data: any
  timestamp: string
  id: string
}

export interface OpportunityDeletedEvent {
  type: 'Opportunity:deleted'
  data: any
  timestamp: string
  id: string
}

export interface CaseCreatedEvent {
  type: 'Case:created'
  data: any
  timestamp: string
  id: string
}

export interface CaseUpdatedEvent {
  type: 'Case:updated'
  data: any
  timestamp: string
  id: string
}

export interface CaseDeletedEvent {
  type: 'Case:deleted'
  data: any
  timestamp: string
  id: string
}

export interface TaskCreatedEvent {
  type: 'Task:created'
  data: any
  timestamp: string
  id: string
}

export interface TaskUpdatedEvent {
  type: 'Task:updated'
  data: any
  timestamp: string
  id: string
}

export interface TaskDeletedEvent {
  type: 'Task:deleted'
  data: any
  timestamp: string
  id: string
}

export interface PlatformEventEvent {
  type: 'platform_event'
  data: any
  timestamp: string
  id: string
}

export interface ChangeDataCaptureEvent {
  type: 'change_data_capture'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | AccountCreatedEvent
  | AccountUpdatedEvent
  | AccountDeletedEvent
  | ContactCreatedEvent
  | ContactUpdatedEvent
  | ContactDeletedEvent
  | LeadCreatedEvent
  | LeadUpdatedEvent
  | LeadDeletedEvent
  | LeadConvertedEvent
  | OpportunityCreatedEvent
  | OpportunityUpdatedEvent
  | OpportunityDeletedEvent
  | CaseCreatedEvent
  | CaseUpdatedEvent
  | CaseDeletedEvent
  | TaskCreatedEvent
  | TaskUpdatedEvent
  | TaskDeletedEvent
  | PlatformEventEvent
  | ChangeDataCaptureEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Salesforce-Signature': string
  payload: string
}

/**
 * Salesforce Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class SalesforceWebhookHandler {
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
    return this.secureCompare(options['X-Salesforce-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Salesforce-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Salesforce-Signature': signature, payload })) {
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
   * Register handler for account.created events
   * @param handler - Event handler function
   */
  onAccountCreated(handler: (event: AccountCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ACCOUNT_CREATED, handler as any)
  }

  /**
   * Register handler for account.updated events
   * @param handler - Event handler function
   */
  onAccountUpdated(handler: (event: AccountUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ACCOUNT_UPDATED, handler as any)
  }

  /**
   * Register handler for account.deleted events
   * @param handler - Event handler function
   */
  onAccountDeleted(handler: (event: AccountDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ACCOUNT_DELETED, handler as any)
  }

  /**
   * Register handler for contact.created events
   * @param handler - Event handler function
   */
  onContactCreated(handler: (event: ContactCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_CREATED, handler as any)
  }

  /**
   * Register handler for contact.updated events
   * @param handler - Event handler function
   */
  onContactUpdated(handler: (event: ContactUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_UPDATED, handler as any)
  }

  /**
   * Register handler for contact.deleted events
   * @param handler - Event handler function
   */
  onContactDeleted(handler: (event: ContactDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_DELETED, handler as any)
  }

  /**
   * Register handler for lead.created events
   * @param handler - Event handler function
   */
  onLeadCreated(handler: (event: LeadCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.LEAD_CREATED, handler as any)
  }

  /**
   * Register handler for lead.updated events
   * @param handler - Event handler function
   */
  onLeadUpdated(handler: (event: LeadUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.LEAD_UPDATED, handler as any)
  }

  /**
   * Register handler for lead.deleted events
   * @param handler - Event handler function
   */
  onLeadDeleted(handler: (event: LeadDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.LEAD_DELETED, handler as any)
  }

  /**
   * Register handler for lead.converted events
   * @param handler - Event handler function
   */
  onLeadConverted(handler: (event: LeadConvertedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.LEAD_CONVERTED, handler as any)
  }

  /**
   * Register handler for opportunity.created events
   * @param handler - Event handler function
   */
  onOpportunityCreated(handler: (event: OpportunityCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.OPPORTUNITY_CREATED, handler as any)
  }

  /**
   * Register handler for opportunity.updated events
   * @param handler - Event handler function
   */
  onOpportunityUpdated(handler: (event: OpportunityUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.OPPORTUNITY_UPDATED, handler as any)
  }

  /**
   * Register handler for opportunity.deleted events
   * @param handler - Event handler function
   */
  onOpportunityDeleted(handler: (event: OpportunityDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.OPPORTUNITY_DELETED, handler as any)
  }

  /**
   * Register handler for case.created events
   * @param handler - Event handler function
   */
  onCaseCreated(handler: (event: CaseCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CASE_CREATED, handler as any)
  }

  /**
   * Register handler for case.updated events
   * @param handler - Event handler function
   */
  onCaseUpdated(handler: (event: CaseUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CASE_UPDATED, handler as any)
  }

  /**
   * Register handler for case.deleted events
   * @param handler - Event handler function
   */
  onCaseDeleted(handler: (event: CaseDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CASE_DELETED, handler as any)
  }

  /**
   * Register handler for task.created events
   * @param handler - Event handler function
   */
  onTaskCreated(handler: (event: TaskCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TASK_CREATED, handler as any)
  }

  /**
   * Register handler for task.updated events
   * @param handler - Event handler function
   */
  onTaskUpdated(handler: (event: TaskUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TASK_UPDATED, handler as any)
  }

  /**
   * Register handler for task.deleted events
   * @param handler - Event handler function
   */
  onTaskDeleted(handler: (event: TaskDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TASK_DELETED, handler as any)
  }

  /**
   * Register handler for platform_event events
   * @param handler - Event handler function
   */
  onPlatformEvent(handler: (event: PlatformEventEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PLATFORM_EVENT, handler as any)
  }

  /**
   * Register handler for change_data_capture events
   * @param handler - Event handler function
   */
  onChangeDataCapture(handler: (event: ChangeDataCaptureEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANGE_DATA_CAPTURE, handler as any)
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
