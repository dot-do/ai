/**
 * Zoom Webhooks
 *
 * Auto-generated webhook handling for Zoom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoom
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  MEETING_STARTED: 'meeting.started',
  MEETING_ENDED: 'meeting.ended',
  MEETING_PARTICIPANT_JOINED: 'meeting.participant_joined',
  MEETING_PARTICIPANT_LEFT: 'meeting.participant_left',
  WEBINAR_STARTED: 'webinar.started',
  WEBINAR_ENDED: 'webinar.ended',
  RECORDING_COMPLETED: 'recording.completed',
  RECORDING_TRANSCRIPT_COMPLETED: 'recording.transcript_completed',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface MeetingStartedEvent {
  type: 'meeting.started'
  data: any
  timestamp: string
  id: string
}

export interface MeetingEndedEvent {
  type: 'meeting.ended'
  data: any
  timestamp: string
  id: string
}

export interface MeetingParticipantJoinedEvent {
  type: 'meeting.participant_joined'
  data: any
  timestamp: string
  id: string
}

export interface MeetingParticipantLeftEvent {
  type: 'meeting.participant_left'
  data: any
  timestamp: string
  id: string
}

export interface WebinarStartedEvent {
  type: 'webinar.started'
  data: any
  timestamp: string
  id: string
}

export interface WebinarEndedEvent {
  type: 'webinar.ended'
  data: any
  timestamp: string
  id: string
}

export interface RecordingCompletedEvent {
  type: 'recording.completed'
  data: any
  timestamp: string
  id: string
}

export interface RecordingTranscriptCompletedEvent {
  type: 'recording.transcript_completed'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | MeetingStartedEvent
  | MeetingEndedEvent
  | MeetingParticipantJoinedEvent
  | MeetingParticipantLeftEvent
  | WebinarStartedEvent
  | WebinarEndedEvent
  | RecordingCompletedEvent
  | RecordingTranscriptCompletedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'x-zm-signature': string
  payload: string
}

/**
 * Zoom Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class ZoomWebhookHandler {
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
    return this.secureCompare(options['x-zm-signature'], expectedSignature)
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
    const signature = request.headers.get('x-zm-signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'x-zm-signature': signature, payload })) {
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
   * Register handler for meeting.started events
   * @param handler - Event handler function
   */
  onMeetingStarted(handler: (event: MeetingStartedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEETING_STARTED, handler as any)
  }

  /**
   * Register handler for meeting.ended events
   * @param handler - Event handler function
   */
  onMeetingEnded(handler: (event: MeetingEndedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEETING_ENDED, handler as any)
  }

  /**
   * Register handler for meeting.participant_joined events
   * @param handler - Event handler function
   */
  onMeetingParticipantJoined(handler: (event: MeetingParticipantJoinedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEETING_PARTICIPANT_JOINED, handler as any)
  }

  /**
   * Register handler for meeting.participant_left events
   * @param handler - Event handler function
   */
  onMeetingParticipantLeft(handler: (event: MeetingParticipantLeftEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MEETING_PARTICIPANT_LEFT, handler as any)
  }

  /**
   * Register handler for webinar.started events
   * @param handler - Event handler function
   */
  onWebinarStarted(handler: (event: WebinarStartedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.WEBINAR_STARTED, handler as any)
  }

  /**
   * Register handler for webinar.ended events
   * @param handler - Event handler function
   */
  onWebinarEnded(handler: (event: WebinarEndedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.WEBINAR_ENDED, handler as any)
  }

  /**
   * Register handler for recording.completed events
   * @param handler - Event handler function
   */
  onRecordingCompleted(handler: (event: RecordingCompletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RECORDING_COMPLETED, handler as any)
  }

  /**
   * Register handler for recording.transcript_completed events
   * @param handler - Event handler function
   */
  onRecordingTranscriptCompleted(handler: (event: RecordingTranscriptCompletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RECORDING_TRANSCRIPT_COMPLETED, handler as any)
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
