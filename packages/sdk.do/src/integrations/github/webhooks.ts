/**
 * GitHub Webhooks
 *
 * Auto-generated webhook handling for GitHub Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/github
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  REPOSITORY_CREATED: 'repository',
  REPOSITORY_DELETED: 'repository',
  REPOSITORY_ARCHIVED: 'repository',
  REPOSITORY_UNARCHIVED: 'repository',
  REPOSITORY_RENAMED: 'repository',
  REPOSITORY_TRANSFERRED: 'repository',
  PUSH: 'push',
  PULL_REQUEST_OPENED: 'pull_request',
  PULL_REQUEST_CLOSED: 'pull_request',
  PULL_REQUEST_REOPENED: 'pull_request',
  PULL_REQUEST_EDITED: 'pull_request',
  PULL_REQUEST_ASSIGNED: 'pull_request',
  PULL_REQUEST_REVIEW_REQUESTED: 'pull_request',
  PULL_REQUEST_SYNCHRONIZED: 'pull_request',
  PULL_REQUEST_REVIEW_SUBMITTED: 'pull_request_review',
  PULL_REQUEST_REVIEW_EDITED: 'pull_request_review',
  PULL_REQUEST_REVIEW_DISMISSED: 'pull_request_review',
  PULL_REQUEST_REVIEW_COMMENT_CREATED: 'pull_request_review_comment',
  ISSUES_OPENED: 'issues',
  ISSUES_EDITED: 'issues',
  ISSUES_DELETED: 'issues',
  ISSUES_CLOSED: 'issues',
  ISSUES_REOPENED: 'issues',
  ISSUES_ASSIGNED: 'issues',
  ISSUES_LABELED: 'issues',
  ISSUE_COMMENT_CREATED: 'issue_comment',
  ISSUE_COMMENT_EDITED: 'issue_comment',
  ISSUE_COMMENT_DELETED: 'issue_comment',
  CREATE: 'create',
  DELETE: 'delete',
  RELEASE_PUBLISHED: 'release',
  RELEASE_CREATED: 'release',
  STATUS: 'status',
  CHECK_RUN_CREATED: 'check_run',
  CHECK_RUN_COMPLETED: 'check_run',
  WORKFLOW_RUN_COMPLETED: 'workflow_run',
  STAR_CREATED: 'star',
  FORK: 'fork',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface RepositoryCreatedEvent {
  type: 'repository'
  data: any
  timestamp: string
  id: string
}

export interface RepositoryDeletedEvent {
  type: 'repository'
  data: any
  timestamp: string
  id: string
}

export interface RepositoryArchivedEvent {
  type: 'repository'
  data: any
  timestamp: string
  id: string
}

export interface RepositoryUnarchivedEvent {
  type: 'repository'
  data: any
  timestamp: string
  id: string
}

export interface RepositoryRenamedEvent {
  type: 'repository'
  data: any
  timestamp: string
  id: string
}

export interface RepositoryTransferredEvent {
  type: 'repository'
  data: any
  timestamp: string
  id: string
}

export interface PushEvent {
  type: 'push'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestOpenedEvent {
  type: 'pull_request'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestClosedEvent {
  type: 'pull_request'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestReopenedEvent {
  type: 'pull_request'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestEditedEvent {
  type: 'pull_request'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestAssignedEvent {
  type: 'pull_request'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestReviewRequestedEvent {
  type: 'pull_request'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestSynchronizedEvent {
  type: 'pull_request'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestReviewSubmittedEvent {
  type: 'pull_request_review'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestReviewEditedEvent {
  type: 'pull_request_review'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestReviewDismissedEvent {
  type: 'pull_request_review'
  data: any
  timestamp: string
  id: string
}

export interface PullRequestReviewCommentCreatedEvent {
  type: 'pull_request_review_comment'
  data: any
  timestamp: string
  id: string
}

export interface IssuesOpenedEvent {
  type: 'issues'
  data: any
  timestamp: string
  id: string
}

export interface IssuesEditedEvent {
  type: 'issues'
  data: any
  timestamp: string
  id: string
}

export interface IssuesDeletedEvent {
  type: 'issues'
  data: any
  timestamp: string
  id: string
}

export interface IssuesClosedEvent {
  type: 'issues'
  data: any
  timestamp: string
  id: string
}

export interface IssuesReopenedEvent {
  type: 'issues'
  data: any
  timestamp: string
  id: string
}

export interface IssuesAssignedEvent {
  type: 'issues'
  data: any
  timestamp: string
  id: string
}

export interface IssuesLabeledEvent {
  type: 'issues'
  data: any
  timestamp: string
  id: string
}

export interface IssueCommentCreatedEvent {
  type: 'issue_comment'
  data: any
  timestamp: string
  id: string
}

export interface IssueCommentEditedEvent {
  type: 'issue_comment'
  data: any
  timestamp: string
  id: string
}

export interface IssueCommentDeletedEvent {
  type: 'issue_comment'
  data: any
  timestamp: string
  id: string
}

export interface CreateEvent {
  type: 'create'
  data: any
  timestamp: string
  id: string
}

export interface DeleteEvent {
  type: 'delete'
  data: any
  timestamp: string
  id: string
}

export interface ReleasePublishedEvent {
  type: 'release'
  data: any
  timestamp: string
  id: string
}

export interface ReleaseCreatedEvent {
  type: 'release'
  data: any
  timestamp: string
  id: string
}

export interface StatusEvent {
  type: 'status'
  data: any
  timestamp: string
  id: string
}

export interface CheckRunCreatedEvent {
  type: 'check_run'
  data: any
  timestamp: string
  id: string
}

export interface CheckRunCompletedEvent {
  type: 'check_run'
  data: any
  timestamp: string
  id: string
}

export interface WorkflowRunCompletedEvent {
  type: 'workflow_run'
  data: any
  timestamp: string
  id: string
}

export interface StarCreatedEvent {
  type: 'star'
  data: any
  timestamp: string
  id: string
}

export interface ForkEvent {
  type: 'fork'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | RepositoryCreatedEvent
  | RepositoryDeletedEvent
  | RepositoryArchivedEvent
  | RepositoryUnarchivedEvent
  | RepositoryRenamedEvent
  | RepositoryTransferredEvent
  | PushEvent
  | PullRequestOpenedEvent
  | PullRequestClosedEvent
  | PullRequestReopenedEvent
  | PullRequestEditedEvent
  | PullRequestAssignedEvent
  | PullRequestReviewRequestedEvent
  | PullRequestSynchronizedEvent
  | PullRequestReviewSubmittedEvent
  | PullRequestReviewEditedEvent
  | PullRequestReviewDismissedEvent
  | PullRequestReviewCommentCreatedEvent
  | IssuesOpenedEvent
  | IssuesEditedEvent
  | IssuesDeletedEvent
  | IssuesClosedEvent
  | IssuesReopenedEvent
  | IssuesAssignedEvent
  | IssuesLabeledEvent
  | IssueCommentCreatedEvent
  | IssueCommentEditedEvent
  | IssueCommentDeletedEvent
  | CreateEvent
  | DeleteEvent
  | ReleasePublishedEvent
  | ReleaseCreatedEvent
  | StatusEvent
  | CheckRunCreatedEvent
  | CheckRunCompletedEvent
  | WorkflowRunCompletedEvent
  | StarCreatedEvent
  | ForkEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'x-hub-signature-256': string
  payload: string
}

/**
 * GitHub Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class GithubWebhookHandler {
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
    return this.secureCompare(options['x-hub-signature-256'], expectedSignature)
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
    const signature = request.headers.get('x-hub-signature-256')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'x-hub-signature-256': signature, payload })) {
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
   * Register handler for repository.created events
   * @param handler - Event handler function
   */
  onRepositoryCreated(handler: (event: RepositoryCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPOSITORY_CREATED, handler as any)
  }

  /**
   * Register handler for repository.deleted events
   * @param handler - Event handler function
   */
  onRepositoryDeleted(handler: (event: RepositoryDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPOSITORY_DELETED, handler as any)
  }

  /**
   * Register handler for repository.archived events
   * @param handler - Event handler function
   */
  onRepositoryArchived(handler: (event: RepositoryArchivedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPOSITORY_ARCHIVED, handler as any)
  }

  /**
   * Register handler for repository.unarchived events
   * @param handler - Event handler function
   */
  onRepositoryUnarchived(handler: (event: RepositoryUnarchivedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPOSITORY_UNARCHIVED, handler as any)
  }

  /**
   * Register handler for repository.renamed events
   * @param handler - Event handler function
   */
  onRepositoryRenamed(handler: (event: RepositoryRenamedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPOSITORY_RENAMED, handler as any)
  }

  /**
   * Register handler for repository.transferred events
   * @param handler - Event handler function
   */
  onRepositoryTransferred(handler: (event: RepositoryTransferredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REPOSITORY_TRANSFERRED, handler as any)
  }

  /**
   * Register handler for push events
   * @param handler - Event handler function
   */
  onPush(handler: (event: PushEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PUSH, handler as any)
  }

  /**
   * Register handler for pull_request.opened events
   * @param handler - Event handler function
   */
  onPullRequestOpened(handler: (event: PullRequestOpenedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_OPENED, handler as any)
  }

  /**
   * Register handler for pull_request.closed events
   * @param handler - Event handler function
   */
  onPullRequestClosed(handler: (event: PullRequestClosedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_CLOSED, handler as any)
  }

  /**
   * Register handler for pull_request.reopened events
   * @param handler - Event handler function
   */
  onPullRequestReopened(handler: (event: PullRequestReopenedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_REOPENED, handler as any)
  }

  /**
   * Register handler for pull_request.edited events
   * @param handler - Event handler function
   */
  onPullRequestEdited(handler: (event: PullRequestEditedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_EDITED, handler as any)
  }

  /**
   * Register handler for pull_request.assigned events
   * @param handler - Event handler function
   */
  onPullRequestAssigned(handler: (event: PullRequestAssignedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_ASSIGNED, handler as any)
  }

  /**
   * Register handler for pull_request.review_requested events
   * @param handler - Event handler function
   */
  onPullRequestReviewRequested(handler: (event: PullRequestReviewRequestedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_REVIEW_REQUESTED, handler as any)
  }

  /**
   * Register handler for pull_request.synchronized events
   * @param handler - Event handler function
   */
  onPullRequestSynchronized(handler: (event: PullRequestSynchronizedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_SYNCHRONIZED, handler as any)
  }

  /**
   * Register handler for pull_request_review.submitted events
   * @param handler - Event handler function
   */
  onPullRequestReviewSubmitted(handler: (event: PullRequestReviewSubmittedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_REVIEW_SUBMITTED, handler as any)
  }

  /**
   * Register handler for pull_request_review.edited events
   * @param handler - Event handler function
   */
  onPullRequestReviewEdited(handler: (event: PullRequestReviewEditedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_REVIEW_EDITED, handler as any)
  }

  /**
   * Register handler for pull_request_review.dismissed events
   * @param handler - Event handler function
   */
  onPullRequestReviewDismissed(handler: (event: PullRequestReviewDismissedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_REVIEW_DISMISSED, handler as any)
  }

  /**
   * Register handler for pull_request_review_comment.created events
   * @param handler - Event handler function
   */
  onPullRequestReviewCommentCreated(handler: (event: PullRequestReviewCommentCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.PULL_REQUEST_REVIEW_COMMENT_CREATED, handler as any)
  }

  /**
   * Register handler for issues.opened events
   * @param handler - Event handler function
   */
  onIssuesOpened(handler: (event: IssuesOpenedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUES_OPENED, handler as any)
  }

  /**
   * Register handler for issues.edited events
   * @param handler - Event handler function
   */
  onIssuesEdited(handler: (event: IssuesEditedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUES_EDITED, handler as any)
  }

  /**
   * Register handler for issues.deleted events
   * @param handler - Event handler function
   */
  onIssuesDeleted(handler: (event: IssuesDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUES_DELETED, handler as any)
  }

  /**
   * Register handler for issues.closed events
   * @param handler - Event handler function
   */
  onIssuesClosed(handler: (event: IssuesClosedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUES_CLOSED, handler as any)
  }

  /**
   * Register handler for issues.reopened events
   * @param handler - Event handler function
   */
  onIssuesReopened(handler: (event: IssuesReopenedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUES_REOPENED, handler as any)
  }

  /**
   * Register handler for issues.assigned events
   * @param handler - Event handler function
   */
  onIssuesAssigned(handler: (event: IssuesAssignedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUES_ASSIGNED, handler as any)
  }

  /**
   * Register handler for issues.labeled events
   * @param handler - Event handler function
   */
  onIssuesLabeled(handler: (event: IssuesLabeledEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUES_LABELED, handler as any)
  }

  /**
   * Register handler for issue_comment.created events
   * @param handler - Event handler function
   */
  onIssueCommentCreated(handler: (event: IssueCommentCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_COMMENT_CREATED, handler as any)
  }

  /**
   * Register handler for issue_comment.edited events
   * @param handler - Event handler function
   */
  onIssueCommentEdited(handler: (event: IssueCommentEditedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_COMMENT_EDITED, handler as any)
  }

  /**
   * Register handler for issue_comment.deleted events
   * @param handler - Event handler function
   */
  onIssueCommentDeleted(handler: (event: IssueCommentDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ISSUE_COMMENT_DELETED, handler as any)
  }

  /**
   * Register handler for create events
   * @param handler - Event handler function
   */
  onCreate(handler: (event: CreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CREATE, handler as any)
  }

  /**
   * Register handler for delete events
   * @param handler - Event handler function
   */
  onDelete(handler: (event: DeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DELETE, handler as any)
  }

  /**
   * Register handler for release.published events
   * @param handler - Event handler function
   */
  onReleasePublished(handler: (event: ReleasePublishedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RELEASE_PUBLISHED, handler as any)
  }

  /**
   * Register handler for release.created events
   * @param handler - Event handler function
   */
  onReleaseCreated(handler: (event: ReleaseCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RELEASE_CREATED, handler as any)
  }

  /**
   * Register handler for status events
   * @param handler - Event handler function
   */
  onStatus(handler: (event: StatusEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.STATUS, handler as any)
  }

  /**
   * Register handler for check_run.created events
   * @param handler - Event handler function
   */
  onCheckRunCreated(handler: (event: CheckRunCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHECK_RUN_CREATED, handler as any)
  }

  /**
   * Register handler for check_run.completed events
   * @param handler - Event handler function
   */
  onCheckRunCompleted(handler: (event: CheckRunCompletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHECK_RUN_COMPLETED, handler as any)
  }

  /**
   * Register handler for workflow_run.completed events
   * @param handler - Event handler function
   */
  onWorkflowRunCompleted(handler: (event: WorkflowRunCompletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.WORKFLOW_RUN_COMPLETED, handler as any)
  }

  /**
   * Register handler for star.created events
   * @param handler - Event handler function
   */
  onStarCreated(handler: (event: StarCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.STAR_CREATED, handler as any)
  }

  /**
   * Register handler for fork events
   * @param handler - Event handler function
   */
  onFork(handler: (event: ForkEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FORK, handler as any)
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
