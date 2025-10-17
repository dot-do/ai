/**
 * HubSpot Webhooks
 *
 * Auto-generated webhook handling for HubSpot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hubspot
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  CONTACT_CREATION: 'contact.creation',
  CONTACT_PROPERTYCHANGE: 'contact.propertyChange',
  CONTACT_DELETION: 'contact.deletion',
  CONTACT_MERGE: 'contact.merge',
  CONTACT_RESTORE: 'contact.restore',
  CONTACT_PRIVACYDELETION: 'contact.privacyDeletion',
  COMPANY_CREATION: 'company.creation',
  COMPANY_PROPERTYCHANGE: 'company.propertyChange',
  COMPANY_DELETION: 'company.deletion',
  COMPANY_MERGE: 'company.merge',
  COMPANY_RESTORE: 'company.restore',
  DEAL_CREATION: 'deal.creation',
  DEAL_PROPERTYCHANGE: 'deal.propertyChange',
  DEAL_DELETION: 'deal.deletion',
  DEAL_MERGE: 'deal.merge',
  DEAL_RESTORE: 'deal.restore',
  TICKET_CREATION: 'ticket.creation',
  TICKET_PROPERTYCHANGE: 'ticket.propertyChange',
  TICKET_DELETION: 'ticket.deletion',
  NOTE_CREATION: 'note.creation',
  EMAIL_CREATION: 'email.creation',
  CALL_CREATION: 'call.creation',
  MEETING_CREATION: 'meeting.creation',
  TASK_CREATION: 'task.creation',
  FORM_SUBMISSION: 'form.submission',
  CONTACT_LISTMEMBERSHIP_ADDED: 'contact.listMembership.added',
  CONTACT_LISTMEMBERSHIP_REMOVED: 'contact.listMembership.removed',
  WORKFLOW_ENROLLMENT: 'workflow.enrollment',
  WORKFLOW_UNENROLLMENT: 'workflow.unenrollment',
  CONVERSATION_CREATION: 'conversation.creation',
  CONVERSATION_PROPERTYCHANGE: 'conversation.propertyChange',
  CONVERSATION_DELETION: 'conversation.deletion',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface ContactCreationEvent {
  type: 'contact.creation'
  data: any
  timestamp: string
  id: string
}

export interface ContactPropertyChangeEvent {
  type: 'contact.propertyChange'
  data: any
  timestamp: string
  id: string
}

export interface ContactDeletionEvent {
  type: 'contact.deletion'
  data: any
  timestamp: string
  id: string
}

export interface ContactMergeEvent {
  type: 'contact.merge'
  data: any
  timestamp: string
  id: string
}

export interface ContactRestoreEvent {
  type: 'contact.restore'
  data: any
  timestamp: string
  id: string
}

export interface ContactPrivacyDeletionEvent {
  type: 'contact.privacyDeletion'
  data: any
  timestamp: string
  id: string
}

export interface CompanyCreationEvent {
  type: 'company.creation'
  data: any
  timestamp: string
  id: string
}

export interface CompanyPropertyChangeEvent {
  type: 'company.propertyChange'
  data: any
  timestamp: string
  id: string
}

export interface CompanyDeletionEvent {
  type: 'company.deletion'
  data: any
  timestamp: string
  id: string
}

export interface CompanyMergeEvent {
  type: 'company.merge'
  data: any
  timestamp: string
  id: string
}

export interface CompanyRestoreEvent {
  type: 'company.restore'
  data: any
  timestamp: string
  id: string
}

export interface DealCreationEvent {
  type: 'deal.creation'
  data: any
  timestamp: string
  id: string
}

export interface DealPropertyChangeEvent {
  type: 'deal.propertyChange'
  data: any
  timestamp: string
  id: string
}

export interface DealDeletionEvent {
  type: 'deal.deletion'
  data: any
  timestamp: string
  id: string
}

export interface DealMergeEvent {
  type: 'deal.merge'
  data: any
  timestamp: string
  id: string
}

export interface DealRestoreEvent {
  type: 'deal.restore'
  data: any
  timestamp: string
  id: string
}

export interface TicketCreationEvent {
  type: 'ticket.creation'
  data: any
  timestamp: string
  id: string
}

export interface TicketPropertyChangeEvent {
  type: 'ticket.propertyChange'
  data: any
  timestamp: string
  id: string
}

export interface TicketDeletionEvent {
  type: 'ticket.deletion'
  data: any
  timestamp: string
  id: string
}

export interface NoteCreationEvent {
  type: 'note.creation'
  data: any
  timestamp: string
  id: string
}

export interface EmailCreationEvent {
  type: 'email.creation'
  data: any
  timestamp: string
  id: string
}

export interface CallCreationEvent {
  type: 'call.creation'
  data: any
  timestamp: string
  id: string
}

export interface MeetingCreationEvent {
  type: 'meeting.creation'
  data: any
  timestamp: string
  id: string
}

export interface TaskCreationEvent {
  type: 'task.creation'
  data: any
  timestamp: string
  id: string
}

export interface FormSubmissionEvent {
  type: 'form.submission'
  data: any
  timestamp: string
  id: string
}

export interface ContactListMembershipAddedEvent {
  type: 'contact.listMembership.added'
  data: any
  timestamp: string
  id: string
}

export interface ContactListMembershipRemovedEvent {
  type: 'contact.listMembership.removed'
  data: any
  timestamp: string
  id: string
}

export interface WorkflowEnrollmentEvent {
  type: 'workflow.enrollment'
  data: any
  timestamp: string
  id: string
}

export interface WorkflowUnenrollmentEvent {
  type: 'workflow.unenrollment'
  data: any
  timestamp: string
  id: string
}

export interface ConversationCreationEvent {
  type: 'conversation.creation'
  data: any
  timestamp: string
  id: string
}

export interface ConversationPropertyChangeEvent {
  type: 'conversation.propertyChange'
  data: any
  timestamp: string
  id: string
}

export interface ConversationDeletionEvent {
  type: 'conversation.deletion'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | ContactCreationEvent
  | ContactPropertyChangeEvent
  | ContactDeletionEvent
  | ContactMergeEvent
  | ContactRestoreEvent
  | ContactPrivacyDeletionEvent
  | CompanyCreationEvent
  | CompanyPropertyChangeEvent
  | CompanyDeletionEvent
  | CompanyMergeEvent
  | CompanyRestoreEvent
  | DealCreationEvent
  | DealPropertyChangeEvent
  | DealDeletionEvent
  | DealMergeEvent
  | DealRestoreEvent
  | TicketCreationEvent
  | TicketPropertyChangeEvent
  | TicketDeletionEvent
  | NoteCreationEvent
  | EmailCreationEvent
  | CallCreationEvent
  | MeetingCreationEvent
  | TaskCreationEvent
  | FormSubmissionEvent
  | ContactListMembershipAddedEvent
  | ContactListMembershipRemovedEvent
  | WorkflowEnrollmentEvent
  | WorkflowUnenrollmentEvent
  | ConversationCreationEvent
  | ConversationPropertyChangeEvent
  | ConversationDeletionEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-HubSpot-Signature': string
  payload: string
}

/**
 * HubSpot Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class HubspotWebhookHandler {
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
    return this.secureCompare(options['X-HubSpot-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-HubSpot-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-HubSpot-Signature': signature, payload })) {
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
   * Register handler for contact.creation events
   * @param handler - Event handler function
   */
  onContactCreation(handler: (event: ContactCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_CREATION, handler as any)
  }

  /**
   * Register handler for contact.propertyChange events
   * @param handler - Event handler function
   */
  onContactPropertyChange(handler: (event: ContactPropertyChangeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_PROPERTYCHANGE, handler as any)
  }

  /**
   * Register handler for contact.deletion events
   * @param handler - Event handler function
   */
  onContactDeletion(handler: (event: ContactDeletionEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_DELETION, handler as any)
  }

  /**
   * Register handler for contact.merge events
   * @param handler - Event handler function
   */
  onContactMerge(handler: (event: ContactMergeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_MERGE, handler as any)
  }

  /**
   * Register handler for contact.restore events
   * @param handler - Event handler function
   */
  onContactRestore(handler: (event: ContactRestoreEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_RESTORE, handler as any)
  }

  /**
   * Register handler for contact.privacyDeletion events
   * @param handler - Event handler function
   */
  onContactPrivacyDeletion(handler: (event: ContactPrivacyDeletionEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_PRIVACYDELETION, handler as any)
  }

  /**
   * Register handler for company.creation events
   * @param handler - Event handler function
   */
  onCompanyCreation(handler: (event: CompanyCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMPANY_CREATION, handler as any)
  }

  /**
   * Register handler for company.propertyChange events
   * @param handler - Event handler function
   */
  onCompanyPropertyChange(handler: (event: CompanyPropertyChangeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMPANY_PROPERTYCHANGE, handler as any)
  }

  /**
   * Register handler for company.deletion events
   * @param handler - Event handler function
   */
  onCompanyDeletion(handler: (event: CompanyDeletionEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMPANY_DELETION, handler as any)
  }

  /**
   * Register handler for company.merge events
   * @param handler - Event handler function
   */
  onCompanyMerge(handler: (event: CompanyMergeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMPANY_MERGE, handler as any)
  }

  /**
   * Register handler for company.restore events
   * @param handler - Event handler function
   */
  onCompanyRestore(handler: (event: CompanyRestoreEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMPANY_RESTORE, handler as any)
  }

  /**
   * Register handler for deal.creation events
   * @param handler - Event handler function
   */
  onDealCreation(handler: (event: DealCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DEAL_CREATION, handler as any)
  }

  /**
   * Register handler for deal.propertyChange events
   * @param handler - Event handler function
   */
  onDealPropertyChange(handler: (event: DealPropertyChangeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DEAL_PROPERTYCHANGE, handler as any)
  }

  /**
   * Register handler for deal.deletion events
   * @param handler - Event handler function
   */
  onDealDeletion(handler: (event: DealDeletionEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DEAL_DELETION, handler as any)
  }

  /**
   * Register handler for deal.merge events
   * @param handler - Event handler function
   */
  onDealMerge(handler: (event: DealMergeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DEAL_MERGE, handler as any)
  }

  /**
   * Register handler for deal.restore events
   * @param handler - Event handler function
   */
  onDealRestore(handler: (event: DealRestoreEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DEAL_RESTORE, handler as any)
  }

  /**
   * Register handler for ticket.creation events
   * @param handler - Event handler function
   */
  onTicketCreation(handler: (event: TicketCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TICKET_CREATION, handler as any)
  }

  /**
   * Register handler for ticket.propertyChange events
   * @param handler - Event handler function
   */
  onTicketPropertyChange(handler: (event: TicketPropertyChangeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TICKET_PROPERTYCHANGE, handler as any)
  }

  /**
   * Register handler for ticket.deletion events
   * @param handler - Event handler function
   */
  onTicketDeletion(handler: (event: TicketDeletionEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TICKET_DELETION, handler as any)
  }

  /**
   * Register handler for note.creation events
   * @param handler - Event handler function
   */
  onNoteCreation(handler: (event: NoteCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.NOTE_CREATION, handler as any)
  }

  /**
   * Register handler for email.creation events
   * @param handler - Event handler function
   */
  onEmailCreation(handler: (event: EmailCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.EMAIL_CREATION, handler as any)
  }

  /**
   * Register handler for call.creation events
   * @param handler - Event handler function
   */
  onCallCreation(handler: (event: CallCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALL_CREATION, handler as any)
  }

  /**
   * Register handler for meeting.creation events
   * @param handler - Event handler function
   */
  onMeetingCreation(handler: (event: MeetingCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEETING_CREATION, handler as any)
  }

  /**
   * Register handler for task.creation events
   * @param handler - Event handler function
   */
  onTaskCreation(handler: (event: TaskCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TASK_CREATION, handler as any)
  }

  /**
   * Register handler for form.submission events
   * @param handler - Event handler function
   */
  onFormSubmission(handler: (event: FormSubmissionEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FORM_SUBMISSION, handler as any)
  }

  /**
   * Register handler for contact.listMembership.added events
   * @param handler - Event handler function
   */
  onContactListMembershipAdded(handler: (event: ContactListMembershipAddedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_LISTMEMBERSHIP_ADDED, handler as any)
  }

  /**
   * Register handler for contact.listMembership.removed events
   * @param handler - Event handler function
   */
  onContactListMembershipRemoved(handler: (event: ContactListMembershipRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONTACT_LISTMEMBERSHIP_REMOVED, handler as any)
  }

  /**
   * Register handler for workflow.enrollment events
   * @param handler - Event handler function
   */
  onWorkflowEnrollment(handler: (event: WorkflowEnrollmentEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.WORKFLOW_ENROLLMENT, handler as any)
  }

  /**
   * Register handler for workflow.unenrollment events
   * @param handler - Event handler function
   */
  onWorkflowUnenrollment(handler: (event: WorkflowUnenrollmentEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.WORKFLOW_UNENROLLMENT, handler as any)
  }

  /**
   * Register handler for conversation.creation events
   * @param handler - Event handler function
   */
  onConversationCreation(handler: (event: ConversationCreationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_CREATION, handler as any)
  }

  /**
   * Register handler for conversation.propertyChange events
   * @param handler - Event handler function
   */
  onConversationPropertyChange(handler: (event: ConversationPropertyChangeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_PROPERTYCHANGE, handler as any)
  }

  /**
   * Register handler for conversation.deletion events
   * @param handler - Event handler function
   */
  onConversationDeletion(handler: (event: ConversationDeletionEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONVERSATION_DELETION, handler as any)
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
