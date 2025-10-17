/**
 * Slack Webhooks
 *
 * Auto-generated webhook handling for Slack Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/slack
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  URL_VERIFICATION: 'url_verification',
  EVENT_CALLBACK: 'event_callback',
  MESSAGE: 'message',
  MESSAGE_CHANNELS: 'message.channels',
  MESSAGE_GROUPS: 'message.groups',
  MESSAGE_IM: 'message.im',
  MESSAGE_MPIM: 'message.mpim',
  APP_MENTION: 'app_mention',
  CHANNEL_CREATED: 'channel_created',
  CHANNEL_DELETED: 'channel_deleted',
  CHANNEL_RENAME: 'channel_rename',
  CHANNEL_ARCHIVE: 'channel_archive',
  CHANNEL_UNARCHIVE: 'channel_unarchive',
  MEMBER_JOINED_CHANNEL: 'member_joined_channel',
  MEMBER_LEFT_CHANNEL: 'member_left_channel',
  TEAM_JOIN: 'team_join',
  USER_CHANGE: 'user_change',
  REACTION_ADDED: 'reaction_added',
  REACTION_REMOVED: 'reaction_removed',
  FILE_SHARED: 'file_shared',
  FILE_PUBLIC: 'file_public',
  FILE_DELETED: 'file_deleted',
  APP_HOME_OPENED: 'app_home_opened',
  APP_UNINSTALLED: 'app_uninstalled',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface UrlVerificationEvent {
  type: 'url_verification'
  data: any
  timestamp: string
  id: string
}

export interface EventCallbackEvent {
  type: 'event_callback'
  data: any
  timestamp: string
  id: string
}

export interface MessageEvent {
  type: 'message'
  data: any
  timestamp: string
  id: string
}

export interface MessageChannelsEvent {
  type: 'message.channels'
  data: any
  timestamp: string
  id: string
}

export interface MessageGroupsEvent {
  type: 'message.groups'
  data: any
  timestamp: string
  id: string
}

export interface MessageImEvent {
  type: 'message.im'
  data: any
  timestamp: string
  id: string
}

export interface MessageMpimEvent {
  type: 'message.mpim'
  data: any
  timestamp: string
  id: string
}

export interface AppMentionEvent {
  type: 'app_mention'
  data: any
  timestamp: string
  id: string
}

export interface ChannelCreatedEvent {
  type: 'channel_created'
  data: any
  timestamp: string
  id: string
}

export interface ChannelDeletedEvent {
  type: 'channel_deleted'
  data: any
  timestamp: string
  id: string
}

export interface ChannelRenameEvent {
  type: 'channel_rename'
  data: any
  timestamp: string
  id: string
}

export interface ChannelArchiveEvent {
  type: 'channel_archive'
  data: any
  timestamp: string
  id: string
}

export interface ChannelUnarchiveEvent {
  type: 'channel_unarchive'
  data: any
  timestamp: string
  id: string
}

export interface MemberJoinedChannelEvent {
  type: 'member_joined_channel'
  data: any
  timestamp: string
  id: string
}

export interface MemberLeftChannelEvent {
  type: 'member_left_channel'
  data: any
  timestamp: string
  id: string
}

export interface TeamJoinEvent {
  type: 'team_join'
  data: any
  timestamp: string
  id: string
}

export interface UserChangeEvent {
  type: 'user_change'
  data: any
  timestamp: string
  id: string
}

export interface ReactionAddedEvent {
  type: 'reaction_added'
  data: any
  timestamp: string
  id: string
}

export interface ReactionRemovedEvent {
  type: 'reaction_removed'
  data: any
  timestamp: string
  id: string
}

export interface FileSharedEvent {
  type: 'file_shared'
  data: any
  timestamp: string
  id: string
}

export interface FilePublicEvent {
  type: 'file_public'
  data: any
  timestamp: string
  id: string
}

export interface FileDeletedEvent {
  type: 'file_deleted'
  data: any
  timestamp: string
  id: string
}

export interface AppHomeOpenedEvent {
  type: 'app_home_opened'
  data: any
  timestamp: string
  id: string
}

export interface AppUninstalledEvent {
  type: 'app_uninstalled'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | UrlVerificationEvent
  | EventCallbackEvent
  | MessageEvent
  | MessageChannelsEvent
  | MessageGroupsEvent
  | MessageImEvent
  | MessageMpimEvent
  | AppMentionEvent
  | ChannelCreatedEvent
  | ChannelDeletedEvent
  | ChannelRenameEvent
  | ChannelArchiveEvent
  | ChannelUnarchiveEvent
  | MemberJoinedChannelEvent
  | MemberLeftChannelEvent
  | TeamJoinEvent
  | UserChangeEvent
  | ReactionAddedEvent
  | ReactionRemovedEvent
  | FileSharedEvent
  | FilePublicEvent
  | FileDeletedEvent
  | AppHomeOpenedEvent
  | AppUninstalledEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Slack-Signature': string
  payload: string
}

/**
 * Slack Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class SlackWebhookHandler {
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
    return this.secureCompare(options['X-Slack-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Slack-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Slack-Signature': signature, payload })) {
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
   * Register handler for url_verification events
   * @param handler - Event handler function
   */
  onUrlVerification(handler: (event: UrlVerificationEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.URL_VERIFICATION, handler as any)
  }

  /**
   * Register handler for event_callback events
   * @param handler - Event handler function
   */
  onEventCallback(handler: (event: EventCallbackEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.EVENT_CALLBACK, handler as any)
  }

  /**
   * Register handler for message events
   * @param handler - Event handler function
   */
  onMessage(handler: (event: MessageEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE, handler as any)
  }

  /**
   * Register handler for message.channels events
   * @param handler - Event handler function
   */
  onMessageChannels(handler: (event: MessageChannelsEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_CHANNELS, handler as any)
  }

  /**
   * Register handler for message.groups events
   * @param handler - Event handler function
   */
  onMessageGroups(handler: (event: MessageGroupsEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_GROUPS, handler as any)
  }

  /**
   * Register handler for message.im events
   * @param handler - Event handler function
   */
  onMessageIm(handler: (event: MessageImEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_IM, handler as any)
  }

  /**
   * Register handler for message.mpim events
   * @param handler - Event handler function
   */
  onMessageMpim(handler: (event: MessageMpimEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_MPIM, handler as any)
  }

  /**
   * Register handler for app_mention events
   * @param handler - Event handler function
   */
  onAppMention(handler: (event: AppMentionEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.APP_MENTION, handler as any)
  }

  /**
   * Register handler for channel_created events
   * @param handler - Event handler function
   */
  onChannelCreated(handler: (event: ChannelCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_CREATED, handler as any)
  }

  /**
   * Register handler for channel_deleted events
   * @param handler - Event handler function
   */
  onChannelDeleted(handler: (event: ChannelDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_DELETED, handler as any)
  }

  /**
   * Register handler for channel_rename events
   * @param handler - Event handler function
   */
  onChannelRename(handler: (event: ChannelRenameEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_RENAME, handler as any)
  }

  /**
   * Register handler for channel_archive events
   * @param handler - Event handler function
   */
  onChannelArchive(handler: (event: ChannelArchiveEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_ARCHIVE, handler as any)
  }

  /**
   * Register handler for channel_unarchive events
   * @param handler - Event handler function
   */
  onChannelUnarchive(handler: (event: ChannelUnarchiveEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_UNARCHIVE, handler as any)
  }

  /**
   * Register handler for member_joined_channel events
   * @param handler - Event handler function
   */
  onMemberJoinedChannel(handler: (event: MemberJoinedChannelEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEMBER_JOINED_CHANNEL, handler as any)
  }

  /**
   * Register handler for member_left_channel events
   * @param handler - Event handler function
   */
  onMemberLeftChannel(handler: (event: MemberLeftChannelEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEMBER_LEFT_CHANNEL, handler as any)
  }

  /**
   * Register handler for team_join events
   * @param handler - Event handler function
   */
  onTeamJoin(handler: (event: TeamJoinEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TEAM_JOIN, handler as any)
  }

  /**
   * Register handler for user_change events
   * @param handler - Event handler function
   */
  onUserChange(handler: (event: UserChangeEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.USER_CHANGE, handler as any)
  }

  /**
   * Register handler for reaction_added events
   * @param handler - Event handler function
   */
  onReactionAdded(handler: (event: ReactionAddedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REACTION_ADDED, handler as any)
  }

  /**
   * Register handler for reaction_removed events
   * @param handler - Event handler function
   */
  onReactionRemoved(handler: (event: ReactionRemovedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.REACTION_REMOVED, handler as any)
  }

  /**
   * Register handler for file_shared events
   * @param handler - Event handler function
   */
  onFileShared(handler: (event: FileSharedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_SHARED, handler as any)
  }

  /**
   * Register handler for file_public events
   * @param handler - Event handler function
   */
  onFilePublic(handler: (event: FilePublicEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_PUBLIC, handler as any)
  }

  /**
   * Register handler for file_deleted events
   * @param handler - Event handler function
   */
  onFileDeleted(handler: (event: FileDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_DELETED, handler as any)
  }

  /**
   * Register handler for app_home_opened events
   * @param handler - Event handler function
   */
  onAppHomeOpened(handler: (event: AppHomeOpenedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.APP_HOME_OPENED, handler as any)
  }

  /**
   * Register handler for app_uninstalled events
   * @param handler - Event handler function
   */
  onAppUninstalled(handler: (event: AppUninstalledEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.APP_UNINSTALLED, handler as any)
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
