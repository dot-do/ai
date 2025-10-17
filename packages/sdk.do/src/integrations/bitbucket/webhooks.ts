/**
 * Bitbucket Webhooks
 *
 * Auto-generated webhook handling for Bitbucket Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bitbucket
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  REPO_PUSH: 'repo:push',
  REPO_COMMIT_STATUS_CREATED: 'repo:commit_status_created',
  REPO_COMMIT_STATUS_UPDATED: 'repo:commit_status_updated',
  PULLREQUEST_CREATED: 'pullrequest:created',
  PULLREQUEST_UPDATED: 'pullrequest:updated',
  PULLREQUEST_APPROVED: 'pullrequest:approved',
  PULLREQUEST_FULFILLED: 'pullrequest:fulfilled',
  ISSUE_CREATED: 'issue:created',
  ISSUE_UPDATED: 'issue:updated',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface RepoPushEvent {
  type: 'repo:push'
  data: any
  timestamp: string
  id: string
}

export interface RepoCommitStatusCreatedEvent {
  type: 'repo:commit_status_created'
  data: any
  timestamp: string
  id: string
}

export interface RepoCommitStatusUpdatedEvent {
  type: 'repo:commit_status_updated'
  data: any
  timestamp: string
  id: string
}

export interface PullrequestCreatedEvent {
  type: 'pullrequest:created'
  data: any
  timestamp: string
  id: string
}

export interface PullrequestUpdatedEvent {
  type: 'pullrequest:updated'
  data: any
  timestamp: string
  id: string
}

export interface PullrequestApprovedEvent {
  type: 'pullrequest:approved'
  data: any
  timestamp: string
  id: string
}

export interface PullrequestFulfilledEvent {
  type: 'pullrequest:fulfilled'
  data: any
  timestamp: string
  id: string
}

export interface IssueCreatedEvent {
  type: 'issue:created'
  data: any
  timestamp: string
  id: string
}

export interface IssueUpdatedEvent {
  type: 'issue:updated'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | RepoPushEvent
  | RepoCommitStatusCreatedEvent
  | RepoCommitStatusUpdatedEvent
  | PullrequestCreatedEvent
  | PullrequestUpdatedEvent
  | PullrequestApprovedEvent
  | PullrequestFulfilledEvent
  | IssueCreatedEvent
  | IssueUpdatedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Hub-Signature': string
  payload: string
}

/**
 * Bitbucket Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class BitbucketWebhookHandler {
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
   * Register handler for repo:push events
   * @param handler - Event handler function
   */
  onRepoPush(handler: (event: RepoPushEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPO_PUSH, handler as any)
  }

  /**
   * Register handler for repo:commit_status_created events
   * @param handler - Event handler function
   */
  onRepoCommitStatusCreated(handler: (event: RepoCommitStatusCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPO_COMMIT_STATUS_CREATED, handler as any)
  }

  /**
   * Register handler for repo:commit_status_updated events
   * @param handler - Event handler function
   */
  onRepoCommitStatusUpdated(handler: (event: RepoCommitStatusUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPO_COMMIT_STATUS_UPDATED, handler as any)
  }

  /**
   * Register handler for pullrequest:created events
   * @param handler - Event handler function
   */
  onPullrequestCreated(handler: (event: PullrequestCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULLREQUEST_CREATED, handler as any)
  }

  /**
   * Register handler for pullrequest:updated events
   * @param handler - Event handler function
   */
  onPullrequestUpdated(handler: (event: PullrequestUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULLREQUEST_UPDATED, handler as any)
  }

  /**
   * Register handler for pullrequest:approved events
   * @param handler - Event handler function
   */
  onPullrequestApproved(handler: (event: PullrequestApprovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULLREQUEST_APPROVED, handler as any)
  }

  /**
   * Register handler for pullrequest:fulfilled events
   * @param handler - Event handler function
   */
  onPullrequestFulfilled(handler: (event: PullrequestFulfilledEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULLREQUEST_FULFILLED, handler as any)
  }

  /**
   * Register handler for issue:created events
   * @param handler - Event handler function
   */
  onIssueCreated(handler: (event: IssueCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_CREATED, handler as any)
  }

  /**
   * Register handler for issue:updated events
   * @param handler - Event handler function
   */
  onIssueUpdated(handler: (event: IssueUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_UPDATED, handler as any)
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
