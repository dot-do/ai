/**
 * Twitter Webhooks
 *
 * Auto-generated webhook handling for Twitter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twitter
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  TWEET_CREATE: 'tweet_create_events',
  TWEET_DELETE: 'tweet_delete_events',
  FOLLOW: 'follow_events',
  UNFOLLOW: 'unfollow_events',
  FAVORITE: 'favorite_events',
  DIRECT_MESSAGE: 'direct_message_events',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface TweetCreateEvent {
  type: 'tweet_create_events'
  data: any
  timestamp: string
  id: string
}

export interface TweetDeleteEvent {
  type: 'tweet_delete_events'
  data: any
  timestamp: string
  id: string
}

export interface FollowEvent {
  type: 'follow_events'
  data: any
  timestamp: string
  id: string
}

export interface UnfollowEvent {
  type: 'unfollow_events'
  data: any
  timestamp: string
  id: string
}

export interface FavoriteEvent {
  type: 'favorite_events'
  data: any
  timestamp: string
  id: string
}

export interface DirectMessageEvent {
  type: 'direct_message_events'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent = TweetCreateEvent | TweetDeleteEvent | FollowEvent | UnfollowEvent | FavoriteEvent | DirectMessageEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Twitter-Webhooks-Signature': string
  payload: string
}

/**
 * Twitter Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class TwitterWebhookHandler {
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
    return this.secureCompare(options['X-Twitter-Webhooks-Signature'], expectedSignature)
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
    const signature = request.headers.get('X-Twitter-Webhooks-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Twitter-Webhooks-Signature': signature, payload })) {
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
   * Register handler for tweet_create events
   * @param handler - Event handler function
   */
  onTweetCreate(handler: (event: TweetCreateEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TWEET_CREATE, handler as any)
  }

  /**
   * Register handler for tweet_delete events
   * @param handler - Event handler function
   */
  onTweetDelete(handler: (event: TweetDeleteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.TWEET_DELETE, handler as any)
  }

  /**
   * Register handler for follow events
   * @param handler - Event handler function
   */
  onFollow(handler: (event: FollowEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FOLLOW, handler as any)
  }

  /**
   * Register handler for unfollow events
   * @param handler - Event handler function
   */
  onUnfollow(handler: (event: UnfollowEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.UNFOLLOW, handler as any)
  }

  /**
   * Register handler for favorite events
   * @param handler - Event handler function
   */
  onFavorite(handler: (event: FavoriteEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FAVORITE, handler as any)
  }

  /**
   * Register handler for direct_message events
   * @param handler - Event handler function
   */
  onDirectMessage(handler: (event: DirectMessageEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DIRECT_MESSAGE, handler as any)
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
