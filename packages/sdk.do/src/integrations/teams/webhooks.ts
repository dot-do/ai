/**
 * Microsoft Teams Webhooks
 *
 * Auto-generated webhook handling for Microsoft Teams Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/teams
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  MESSAGE_CREATED: 'chatMessage/created',
  MESSAGE_UPDATED: 'chatMessage/updated',
  MESSAGE_DELETED: 'chatMessage/deleted',
  CHANNEL_CREATED: 'channel/created',
  CHANNEL_UPDATED: 'channel/updated',
  CHANNEL_DELETED: 'channel/deleted',
  TEAM_CREATED: 'team/created',
  TEAM_UPDATED: 'team/updated',
  TEAM_DELETED: 'team/deleted',
  MEMBER_ADDED: 'conversationMember/added',
  MEMBER_REMOVED: 'conversationMember/removed',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface MessageCreatedEvent {
  type: 'chatMessage/created'
  data: any
  timestamp: string
  id: string
}

export interface MessageUpdatedEvent {
  type: 'chatMessage/updated'
  data: any
  timestamp: string
  id: string
}

export interface MessageDeletedEvent {
  type: 'chatMessage/deleted'
  data: any
  timestamp: string
  id: string
}

export interface ChannelCreatedEvent {
  type: 'channel/created'
  data: any
  timestamp: string
  id: string
}

export interface ChannelUpdatedEvent {
  type: 'channel/updated'
  data: any
  timestamp: string
  id: string
}

export interface ChannelDeletedEvent {
  type: 'channel/deleted'
  data: any
  timestamp: string
  id: string
}

export interface TeamCreatedEvent {
  type: 'team/created'
  data: any
  timestamp: string
  id: string
}

export interface TeamUpdatedEvent {
  type: 'team/updated'
  data: any
  timestamp: string
  id: string
}

export interface TeamDeletedEvent {
  type: 'team/deleted'
  data: any
  timestamp: string
  id: string
}

export interface MemberAddedEvent {
  type: 'conversationMember/added'
  data: any
  timestamp: string
  id: string
}

export interface MemberRemovedEvent {
  type: 'conversationMember/removed'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | MessageCreatedEvent
  | MessageUpdatedEvent
  | MessageDeletedEvent
  | ChannelCreatedEvent
  | ChannelUpdatedEvent
  | ChannelDeletedEvent
  | TeamCreatedEvent
  | TeamUpdatedEvent
  | TeamDeletedEvent
  | MemberAddedEvent
  | MemberRemovedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-MS-Token': string
  payload: string
}

/**
 * Microsoft Teams Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class TeamsWebhookHandler {
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
    return this.secureCompare(options['X-MS-Token'], expectedSignature)
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
    const signature = request.headers.get('X-MS-Token')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-MS-Token': signature, payload })) {
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
   * Register handler for message.created events
   * @param handler - Event handler function
   */
  onMessageCreated(handler: (event: MessageCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_CREATED, handler as any)
  }

  /**
   * Register handler for message.updated events
   * @param handler - Event handler function
   */
  onMessageUpdated(handler: (event: MessageUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_UPDATED, handler as any)
  }

  /**
   * Register handler for message.deleted events
   * @param handler - Event handler function
   */
  onMessageDeleted(handler: (event: MessageDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_DELETED, handler as any)
  }

  /**
   * Register handler for channel.created events
   * @param handler - Event handler function
   */
  onChannelCreated(handler: (event: ChannelCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_CREATED, handler as any)
  }

  /**
   * Register handler for channel.updated events
   * @param handler - Event handler function
   */
  onChannelUpdated(handler: (event: ChannelUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_UPDATED, handler as any)
  }

  /**
   * Register handler for channel.deleted events
   * @param handler - Event handler function
   */
  onChannelDeleted(handler: (event: ChannelDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_DELETED, handler as any)
  }

  /**
   * Register handler for team.created events
   * @param handler - Event handler function
   */
  onTeamCreated(handler: (event: TeamCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TEAM_CREATED, handler as any)
  }

  /**
   * Register handler for team.updated events
   * @param handler - Event handler function
   */
  onTeamUpdated(handler: (event: TeamUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TEAM_UPDATED, handler as any)
  }

  /**
   * Register handler for team.deleted events
   * @param handler - Event handler function
   */
  onTeamDeleted(handler: (event: TeamDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TEAM_DELETED, handler as any)
  }

  /**
   * Register handler for member.added events
   * @param handler - Event handler function
   */
  onMemberAdded(handler: (event: MemberAddedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEMBER_ADDED, handler as any)
  }

  /**
   * Register handler for member.removed events
   * @param handler - Event handler function
   */
  onMemberRemoved(handler: (event: MemberRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEMBER_REMOVED, handler as any)
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
