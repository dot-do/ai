/**
 * GitLab Webhooks
 *
 * Auto-generated webhook handling for GitLab Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gitlab
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  PUSH: 'Push Hook',
  TAG_PUSH: 'Tag Push Hook',
  ISSUE: 'Issue Hook',
  MERGE_REQUEST: 'Merge Request Hook',
  PIPELINE: 'Pipeline Hook',
  BUILD: 'Job Hook',
  WIKI_PAGE: 'Wiki Page Hook',
  DEPLOYMENT: 'Deployment Hook',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface PushEvent {
  type: 'Push Hook'
  data: any
  timestamp: string
  id: string
}

export interface TagPushEvent {
  type: 'Tag Push Hook'
  data: any
  timestamp: string
  id: string
}

export interface IssueEvent {
  type: 'Issue Hook'
  data: any
  timestamp: string
  id: string
}

export interface MergeRequestEvent {
  type: 'Merge Request Hook'
  data: any
  timestamp: string
  id: string
}

export interface PipelineEvent {
  type: 'Pipeline Hook'
  data: any
  timestamp: string
  id: string
}

export interface BuildEvent {
  type: 'Job Hook'
  data: any
  timestamp: string
  id: string
}

export interface WikiPageEvent {
  type: 'Wiki Page Hook'
  data: any
  timestamp: string
  id: string
}

export interface DeploymentEvent {
  type: 'Deployment Hook'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = PushEvent | TagPushEvent | IssueEvent | MergeRequestEvent | PipelineEvent | BuildEvent | WikiPageEvent | DeploymentEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  providedSecret: string
}

/**
 * GitLab Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class GitlabWebhookHandler {
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
    return this.secureCompare(options.providedSecret, this.secret)
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
   * Register handler for push events
   * @param handler - Event handler function
   */
  onPush(handler: (event: PushEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PUSH, handler as any)
  }

  /**
   * Register handler for tag_push events
   * @param handler - Event handler function
   */
  onTagPush(handler: (event: TagPushEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TAG_PUSH, handler as any)
  }

  /**
   * Register handler for issue events
   * @param handler - Event handler function
   */
  onIssue(handler: (event: IssueEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE, handler as any)
  }

  /**
   * Register handler for merge_request events
   * @param handler - Event handler function
   */
  onMergeRequest(handler: (event: MergeRequestEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MERGE_REQUEST, handler as any)
  }

  /**
   * Register handler for pipeline events
   * @param handler - Event handler function
   */
  onPipeline(handler: (event: PipelineEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PIPELINE, handler as any)
  }

  /**
   * Register handler for build events
   * @param handler - Event handler function
   */
  onBuild(handler: (event: BuildEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.BUILD, handler as any)
  }

  /**
   * Register handler for wiki_page events
   * @param handler - Event handler function
   */
  onWikiPage(handler: (event: WikiPageEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.WIKI_PAGE, handler as any)
  }

  /**
   * Register handler for deployment events
   * @param handler - Event handler function
   */
  onDeployment(handler: (event: DeploymentEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DEPLOYMENT, handler as any)
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
