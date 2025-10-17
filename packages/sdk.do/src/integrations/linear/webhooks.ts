/**
 * Linear Webhooks
 *
 * Auto-generated webhook handling for Linear Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/linear
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  ISSUE_CREATED: 'Issue.create',
  ISSUE_UPDATED: 'Issue.update',
  ISSUE_REMOVED: 'Issue.remove',
  COMMENT_CREATED: 'Comment.create',
  COMMENT_UPDATED: 'Comment.update',
  COMMENT_REMOVED: 'Comment.remove',
  PROJECT_CREATED: 'Project.create',
  PROJECT_UPDATED: 'Project.update',
  PROJECT_REMOVED: 'Project.remove',
  CYCLE_CREATED: 'Cycle.create',
  CYCLE_UPDATED: 'Cycle.update',
  CYCLE_REMOVED: 'Cycle.remove',
  LABEL_CREATED: 'IssueLabel.create',
  LABEL_UPDATED: 'IssueLabel.update',
  LABEL_REMOVED: 'IssueLabel.remove',
  USER_CREATED: 'User.create',
  USER_UPDATED: 'User.update',
  USER_REMOVED: 'User.remove',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface IssueCreatedEvent {
  type: 'Issue.create'
  data: any
  timestamp: string
  id: string
}

export interface IssueUpdatedEvent {
  type: 'Issue.update'
  data: any
  timestamp: string
  id: string
}

export interface IssueRemovedEvent {
  type: 'Issue.remove'
  data: any
  timestamp: string
  id: string
}

export interface CommentCreatedEvent {
  type: 'Comment.create'
  data: any
  timestamp: string
  id: string
}

export interface CommentUpdatedEvent {
  type: 'Comment.update'
  data: any
  timestamp: string
  id: string
}

export interface CommentRemovedEvent {
  type: 'Comment.remove'
  data: any
  timestamp: string
  id: string
}

export interface ProjectCreatedEvent {
  type: 'Project.create'
  data: any
  timestamp: string
  id: string
}

export interface ProjectUpdatedEvent {
  type: 'Project.update'
  data: any
  timestamp: string
  id: string
}

export interface ProjectRemovedEvent {
  type: 'Project.remove'
  data: any
  timestamp: string
  id: string
}

export interface CycleCreatedEvent {
  type: 'Cycle.create'
  data: any
  timestamp: string
  id: string
}

export interface CycleUpdatedEvent {
  type: 'Cycle.update'
  data: any
  timestamp: string
  id: string
}

export interface CycleRemovedEvent {
  type: 'Cycle.remove'
  data: any
  timestamp: string
  id: string
}

export interface LabelCreatedEvent {
  type: 'IssueLabel.create'
  data: any
  timestamp: string
  id: string
}

export interface LabelUpdatedEvent {
  type: 'IssueLabel.update'
  data: any
  timestamp: string
  id: string
}

export interface LabelRemovedEvent {
  type: 'IssueLabel.remove'
  data: any
  timestamp: string
  id: string
}

export interface UserCreatedEvent {
  type: 'User.create'
  data: any
  timestamp: string
  id: string
}

export interface UserUpdatedEvent {
  type: 'User.update'
  data: any
  timestamp: string
  id: string
}

export interface UserRemovedEvent {
  type: 'User.remove'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | IssueCreatedEvent
  | IssueUpdatedEvent
  | IssueRemovedEvent
  | CommentCreatedEvent
  | CommentUpdatedEvent
  | CommentRemovedEvent
  | ProjectCreatedEvent
  | ProjectUpdatedEvent
  | ProjectRemovedEvent
  | CycleCreatedEvent
  | CycleUpdatedEvent
  | CycleRemovedEvent
  | LabelCreatedEvent
  | LabelUpdatedEvent
  | LabelRemovedEvent
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserRemovedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'linear-signature': string
  payload: string
}

/**
 * Linear Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class LinearWebhookHandler {
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
    return this.secureCompare(options['linear-signature'], expectedSignature)
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
    const signature = request.headers.get('linear-signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'linear-signature': signature, payload })) {
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
   * Register handler for issue.created events
   * @param handler - Event handler function
   */
  onIssueCreated(handler: (event: IssueCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_CREATED, handler as any)
  }

  /**
   * Register handler for issue.updated events
   * @param handler - Event handler function
   */
  onIssueUpdated(handler: (event: IssueUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_UPDATED, handler as any)
  }

  /**
   * Register handler for issue.removed events
   * @param handler - Event handler function
   */
  onIssueRemoved(handler: (event: IssueRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_REMOVED, handler as any)
  }

  /**
   * Register handler for comment.created events
   * @param handler - Event handler function
   */
  onCommentCreated(handler: (event: CommentCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMMENT_CREATED, handler as any)
  }

  /**
   * Register handler for comment.updated events
   * @param handler - Event handler function
   */
  onCommentUpdated(handler: (event: CommentUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMMENT_UPDATED, handler as any)
  }

  /**
   * Register handler for comment.removed events
   * @param handler - Event handler function
   */
  onCommentRemoved(handler: (event: CommentRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.COMMENT_REMOVED, handler as any)
  }

  /**
   * Register handler for project.created events
   * @param handler - Event handler function
   */
  onProjectCreated(handler: (event: ProjectCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PROJECT_CREATED, handler as any)
  }

  /**
   * Register handler for project.updated events
   * @param handler - Event handler function
   */
  onProjectUpdated(handler: (event: ProjectUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PROJECT_UPDATED, handler as any)
  }

  /**
   * Register handler for project.removed events
   * @param handler - Event handler function
   */
  onProjectRemoved(handler: (event: ProjectRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PROJECT_REMOVED, handler as any)
  }

  /**
   * Register handler for cycle.created events
   * @param handler - Event handler function
   */
  onCycleCreated(handler: (event: CycleCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CYCLE_CREATED, handler as any)
  }

  /**
   * Register handler for cycle.updated events
   * @param handler - Event handler function
   */
  onCycleUpdated(handler: (event: CycleUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CYCLE_UPDATED, handler as any)
  }

  /**
   * Register handler for cycle.removed events
   * @param handler - Event handler function
   */
  onCycleRemoved(handler: (event: CycleRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CYCLE_REMOVED, handler as any)
  }

  /**
   * Register handler for label.created events
   * @param handler - Event handler function
   */
  onLabelCreated(handler: (event: LabelCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.LABEL_CREATED, handler as any)
  }

  /**
   * Register handler for label.updated events
   * @param handler - Event handler function
   */
  onLabelUpdated(handler: (event: LabelUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.LABEL_UPDATED, handler as any)
  }

  /**
   * Register handler for label.removed events
   * @param handler - Event handler function
   */
  onLabelRemoved(handler: (event: LabelRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.LABEL_REMOVED, handler as any)
  }

  /**
   * Register handler for user.created events
   * @param handler - Event handler function
   */
  onUserCreated(handler: (event: UserCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.USER_CREATED, handler as any)
  }

  /**
   * Register handler for user.updated events
   * @param handler - Event handler function
   */
  onUserUpdated(handler: (event: UserUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.USER_UPDATED, handler as any)
  }

  /**
   * Register handler for user.removed events
   * @param handler - Event handler function
   */
  onUserRemoved(handler: (event: UserRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.USER_REMOVED, handler as any)
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
