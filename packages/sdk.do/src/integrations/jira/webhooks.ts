/**
 * Jira Webhooks
 *
 * Auto-generated webhook handling for Jira Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/jira
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  JIRA_ISSUE_CREATED: 'jira:issue_created',
  JIRA_ISSUE_UPDATED: 'jira:issue_updated',
  JIRA_ISSUE_DELETED: 'jira:issue_deleted',
  SPRINT_CREATED: 'sprint_created',
  SPRINT_STARTED: 'sprint_started',
  SPRINT_CLOSED: 'sprint_closed',
  BOARD_CREATED: 'board_created',
  BOARD_UPDATED: 'board_updated',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface JiraIssueCreatedEvent {
  type: 'jira:issue_created'
  data: any
  timestamp: string
  id: string
}

export interface JiraIssueUpdatedEvent {
  type: 'jira:issue_updated'
  data: any
  timestamp: string
  id: string
}

export interface JiraIssueDeletedEvent {
  type: 'jira:issue_deleted'
  data: any
  timestamp: string
  id: string
}

export interface SprintCreatedEvent {
  type: 'sprint_created'
  data: any
  timestamp: string
  id: string
}

export interface SprintStartedEvent {
  type: 'sprint_started'
  data: any
  timestamp: string
  id: string
}

export interface SprintClosedEvent {
  type: 'sprint_closed'
  data: any
  timestamp: string
  id: string
}

export interface BoardCreatedEvent {
  type: 'board_created'
  data: any
  timestamp: string
  id: string
}

export interface BoardUpdatedEvent {
  type: 'board_updated'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | JiraIssueCreatedEvent
  | JiraIssueUpdatedEvent
  | JiraIssueDeletedEvent
  | SprintCreatedEvent
  | SprintStartedEvent
  | SprintClosedEvent
  | BoardCreatedEvent
  | BoardUpdatedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Hub-Signature': string
  payload: string
}

/**
 * Jira Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class JiraWebhookHandler {
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
    return this.secureCompare(options['X-Hub-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Hub-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Hub-Signature': signature, payload })) {
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
   * Register handler for jira:issue_created events
   * @param handler - Event handler function
   */
  onJiraIssueCreated(handler: (event: JiraIssueCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.JIRA_ISSUE_CREATED, handler as any)
  }

  /**
   * Register handler for jira:issue_updated events
   * @param handler - Event handler function
   */
  onJiraIssueUpdated(handler: (event: JiraIssueUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.JIRA_ISSUE_UPDATED, handler as any)
  }

  /**
   * Register handler for jira:issue_deleted events
   * @param handler - Event handler function
   */
  onJiraIssueDeleted(handler: (event: JiraIssueDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.JIRA_ISSUE_DELETED, handler as any)
  }

  /**
   * Register handler for sprint_created events
   * @param handler - Event handler function
   */
  onSprintCreated(handler: (event: SprintCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SPRINT_CREATED, handler as any)
  }

  /**
   * Register handler for sprint_started events
   * @param handler - Event handler function
   */
  onSprintStarted(handler: (event: SprintStartedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SPRINT_STARTED, handler as any)
  }

  /**
   * Register handler for sprint_closed events
   * @param handler - Event handler function
   */
  onSprintClosed(handler: (event: SprintClosedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.SPRINT_CLOSED, handler as any)
  }

  /**
   * Register handler for board_created events
   * @param handler - Event handler function
   */
  onBoardCreated(handler: (event: BoardCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BOARD_CREATED, handler as any)
  }

  /**
   * Register handler for board_updated events
   * @param handler - Event handler function
   */
  onBoardUpdated(handler: (event: BoardUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BOARD_UPDATED, handler as any)
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
