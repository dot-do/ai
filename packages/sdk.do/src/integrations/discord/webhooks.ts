/**
 * Discord Webhooks
 *
 * Auto-generated webhook handling for Discord Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/discord
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  MESSAGE_CREATE: 'MESSAGE_CREATE',
  MESSAGE_UPDATE: 'MESSAGE_UPDATE',
  MESSAGE_DELETE: 'MESSAGE_DELETE',
  CHANNEL_CREATE: 'CHANNEL_CREATE',
  CHANNEL_UPDATE: 'CHANNEL_UPDATE',
  CHANNEL_DELETE: 'CHANNEL_DELETE',
  GUILD_CREATE: 'GUILD_CREATE',
  GUILD_UPDATE: 'GUILD_UPDATE',
  GUILD_DELETE: 'GUILD_DELETE',
  MEMBER_ADD: 'GUILD_MEMBER_ADD',
  MEMBER_REMOVE: 'GUILD_MEMBER_REMOVE',
  MEMBER_UPDATE: 'GUILD_MEMBER_UPDATE',
  ROLE_CREATE: 'GUILD_ROLE_CREATE',
  ROLE_UPDATE: 'GUILD_ROLE_UPDATE',
  ROLE_DELETE: 'GUILD_ROLE_DELETE',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface MessageCreateEvent {
  type: 'MESSAGE_CREATE'
  data: any
  timestamp: string
  id: string
}

export interface MessageUpdateEvent {
  type: 'MESSAGE_UPDATE'
  data: any
  timestamp: string
  id: string
}

export interface MessageDeleteEvent {
  type: 'MESSAGE_DELETE'
  data: any
  timestamp: string
  id: string
}

export interface ChannelCreateEvent {
  type: 'CHANNEL_CREATE'
  data: any
  timestamp: string
  id: string
}

export interface ChannelUpdateEvent {
  type: 'CHANNEL_UPDATE'
  data: any
  timestamp: string
  id: string
}

export interface ChannelDeleteEvent {
  type: 'CHANNEL_DELETE'
  data: any
  timestamp: string
  id: string
}

export interface GuildCreateEvent {
  type: 'GUILD_CREATE'
  data: any
  timestamp: string
  id: string
}

export interface GuildUpdateEvent {
  type: 'GUILD_UPDATE'
  data: any
  timestamp: string
  id: string
}

export interface GuildDeleteEvent {
  type: 'GUILD_DELETE'
  data: any
  timestamp: string
  id: string
}

export interface MemberAddEvent {
  type: 'GUILD_MEMBER_ADD'
  data: any
  timestamp: string
  id: string
}

export interface MemberRemoveEvent {
  type: 'GUILD_MEMBER_REMOVE'
  data: any
  timestamp: string
  id: string
}

export interface MemberUpdateEvent {
  type: 'GUILD_MEMBER_UPDATE'
  data: any
  timestamp: string
  id: string
}

export interface RoleCreateEvent {
  type: 'GUILD_ROLE_CREATE'
  data: any
  timestamp: string
  id: string
}

export interface RoleUpdateEvent {
  type: 'GUILD_ROLE_UPDATE'
  data: any
  timestamp: string
  id: string
}

export interface RoleDeleteEvent {
  type: 'GUILD_ROLE_DELETE'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | MessageCreateEvent
  | MessageUpdateEvent
  | MessageDeleteEvent
  | ChannelCreateEvent
  | ChannelUpdateEvent
  | ChannelDeleteEvent
  | GuildCreateEvent
  | GuildUpdateEvent
  | GuildDeleteEvent
  | MemberAddEvent
  | MemberRemoveEvent
  | MemberUpdateEvent
  | RoleCreateEvent
  | RoleUpdateEvent
  | RoleDeleteEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Signature-Ed25519': string
  payload: string
}

/**
 * Discord Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class DiscordWebhookHandler {
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
    return this.secureCompare(options['X-Signature-Ed25519'], expectedSignature)
  }

  /**
   * Generate webhook signature
   * @param payload - Webhook payload
   * @returns HMAC signature
   */
  private generateSignature(payload: string): string {
    const hmac = createHmac('ed25519', this.secret)
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
    const signature = request.headers.get('X-Signature-Ed25519')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Signature-Ed25519': signature, payload })) {
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
   * Register handler for message.create events
   * @param handler - Event handler function
   */
  onMessageCreate(handler: (event: MessageCreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_CREATE, handler as any)
  }

  /**
   * Register handler for message.update events
   * @param handler - Event handler function
   */
  onMessageUpdate(handler: (event: MessageUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_UPDATE, handler as any)
  }

  /**
   * Register handler for message.delete events
   * @param handler - Event handler function
   */
  onMessageDelete(handler: (event: MessageDeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_DELETE, handler as any)
  }

  /**
   * Register handler for channel.create events
   * @param handler - Event handler function
   */
  onChannelCreate(handler: (event: ChannelCreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_CREATE, handler as any)
  }

  /**
   * Register handler for channel.update events
   * @param handler - Event handler function
   */
  onChannelUpdate(handler: (event: ChannelUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_UPDATE, handler as any)
  }

  /**
   * Register handler for channel.delete events
   * @param handler - Event handler function
   */
  onChannelDelete(handler: (event: ChannelDeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CHANNEL_DELETE, handler as any)
  }

  /**
   * Register handler for guild.create events
   * @param handler - Event handler function
   */
  onGuildCreate(handler: (event: GuildCreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GUILD_CREATE, handler as any)
  }

  /**
   * Register handler for guild.update events
   * @param handler - Event handler function
   */
  onGuildUpdate(handler: (event: GuildUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GUILD_UPDATE, handler as any)
  }

  /**
   * Register handler for guild.delete events
   * @param handler - Event handler function
   */
  onGuildDelete(handler: (event: GuildDeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GUILD_DELETE, handler as any)
  }

  /**
   * Register handler for member.add events
   * @param handler - Event handler function
   */
  onMemberAdd(handler: (event: MemberAddEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEMBER_ADD, handler as any)
  }

  /**
   * Register handler for member.remove events
   * @param handler - Event handler function
   */
  onMemberRemove(handler: (event: MemberRemoveEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEMBER_REMOVE, handler as any)
  }

  /**
   * Register handler for member.update events
   * @param handler - Event handler function
   */
  onMemberUpdate(handler: (event: MemberUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEMBER_UPDATE, handler as any)
  }

  /**
   * Register handler for role.create events
   * @param handler - Event handler function
   */
  onRoleCreate(handler: (event: RoleCreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ROLE_CREATE, handler as any)
  }

  /**
   * Register handler for role.update events
   * @param handler - Event handler function
   */
  onRoleUpdate(handler: (event: RoleUpdateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ROLE_UPDATE, handler as any)
  }

  /**
   * Register handler for role.delete events
   * @param handler - Event handler function
   */
  onRoleDelete(handler: (event: RoleDeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.ROLE_DELETE, handler as any)
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
