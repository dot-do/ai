/**
 * Twilio Webhooks
 *
 * Auto-generated webhook handling for Twilio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twilio
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  MESSAGE_SENT: 'message.sent',
  MESSAGE_DELIVERED: 'message.delivered',
  MESSAGE_FAILED: 'message.failed',
  MESSAGE_UNDELIVERED: 'message.undelivered',
  MESSAGE_RECEIVED: 'message.received',
  CALL_INITIATED: 'call.initiated',
  CALL_RINGING: 'call.ringing',
  CALL_ANSWERED: 'call.answered',
  CALL_COMPLETED: 'call.completed',
  CALL_FAILED: 'call.failed',
  CALL_BUSY: 'call.busy',
  CALL_NO_ANSWER: 'call.no_answer',
  RECORDING_AVAILABLE: 'recording.available',
  RECORDING_FAILED: 'recording.failed',
  CONFERENCE_START: 'conference.start',
  CONFERENCE_END: 'conference.end',
  CONFERENCE_PARTICIPANT_JOIN: 'conference.participant.join',
  CONFERENCE_PARTICIPANT_LEAVE: 'conference.participant.leave',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface MessageSentEvent {
  type: 'message.sent'
  data: any
  timestamp: string
  id: string
}

export interface MessageDeliveredEvent {
  type: 'message.delivered'
  data: any
  timestamp: string
  id: string
}

export interface MessageFailedEvent {
  type: 'message.failed'
  data: any
  timestamp: string
  id: string
}

export interface MessageUndeliveredEvent {
  type: 'message.undelivered'
  data: any
  timestamp: string
  id: string
}

export interface MessageReceivedEvent {
  type: 'message.received'
  data: any
  timestamp: string
  id: string
}

export interface CallInitiatedEvent {
  type: 'call.initiated'
  data: any
  timestamp: string
  id: string
}

export interface CallRingingEvent {
  type: 'call.ringing'
  data: any
  timestamp: string
  id: string
}

export interface CallAnsweredEvent {
  type: 'call.answered'
  data: any
  timestamp: string
  id: string
}

export interface CallCompletedEvent {
  type: 'call.completed'
  data: any
  timestamp: string
  id: string
}

export interface CallFailedEvent {
  type: 'call.failed'
  data: any
  timestamp: string
  id: string
}

export interface CallBusyEvent {
  type: 'call.busy'
  data: any
  timestamp: string
  id: string
}

export interface CallNoAnswerEvent {
  type: 'call.no_answer'
  data: any
  timestamp: string
  id: string
}

export interface RecordingAvailableEvent {
  type: 'recording.available'
  data: any
  timestamp: string
  id: string
}

export interface RecordingFailedEvent {
  type: 'recording.failed'
  data: any
  timestamp: string
  id: string
}

export interface ConferenceStartEvent {
  type: 'conference.start'
  data: any
  timestamp: string
  id: string
}

export interface ConferenceEndEvent {
  type: 'conference.end'
  data: any
  timestamp: string
  id: string
}

export interface ConferenceParticipantJoinEvent {
  type: 'conference.participant.join'
  data: any
  timestamp: string
  id: string
}

export interface ConferenceParticipantLeaveEvent {
  type: 'conference.participant.leave'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | MessageSentEvent
  | MessageDeliveredEvent
  | MessageFailedEvent
  | MessageUndeliveredEvent
  | MessageReceivedEvent
  | CallInitiatedEvent
  | CallRingingEvent
  | CallAnsweredEvent
  | CallCompletedEvent
  | CallFailedEvent
  | CallBusyEvent
  | CallNoAnswerEvent
  | RecordingAvailableEvent
  | RecordingFailedEvent
  | ConferenceStartEvent
  | ConferenceEndEvent
  | ConferenceParticipantJoinEvent
  | ConferenceParticipantLeaveEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'X-Twilio-Signature': string
  payload: string
}

/**
 * Twilio Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class TwilioWebhookHandler {
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
    return this.secureCompare(options['X-Twilio-Signature'], expectedSignature)
  }

  /**
   * Generate webhook signature
   * @param payload - Webhook payload
   * @returns HMAC signature
   */
  private generateSignature(payload: string): string {
    const hmac = createHmac('sha1', this.secret)
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
    const signature = request.headers.get('X-Twilio-Signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'X-Twilio-Signature': signature, payload })) {
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
   * Register handler for message.sent events
   * @param handler - Event handler function
   */
  onMessageSent(handler: (event: MessageSentEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_SENT, handler as any)
  }

  /**
   * Register handler for message.delivered events
   * @param handler - Event handler function
   */
  onMessageDelivered(handler: (event: MessageDeliveredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_DELIVERED, handler as any)
  }

  /**
   * Register handler for message.failed events
   * @param handler - Event handler function
   */
  onMessageFailed(handler: (event: MessageFailedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_FAILED, handler as any)
  }

  /**
   * Register handler for message.undelivered events
   * @param handler - Event handler function
   */
  onMessageUndelivered(handler: (event: MessageUndeliveredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_UNDELIVERED, handler as any)
  }

  /**
   * Register handler for message.received events
   * @param handler - Event handler function
   */
  onMessageReceived(handler: (event: MessageReceivedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.MESSAGE_RECEIVED, handler as any)
  }

  /**
   * Register handler for call.initiated events
   * @param handler - Event handler function
   */
  onCallInitiated(handler: (event: CallInitiatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALL_INITIATED, handler as any)
  }

  /**
   * Register handler for call.ringing events
   * @param handler - Event handler function
   */
  onCallRinging(handler: (event: CallRingingEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALL_RINGING, handler as any)
  }

  /**
   * Register handler for call.answered events
   * @param handler - Event handler function
   */
  onCallAnswered(handler: (event: CallAnsweredEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALL_ANSWERED, handler as any)
  }

  /**
   * Register handler for call.completed events
   * @param handler - Event handler function
   */
  onCallCompleted(handler: (event: CallCompletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALL_COMPLETED, handler as any)
  }

  /**
   * Register handler for call.failed events
   * @param handler - Event handler function
   */
  onCallFailed(handler: (event: CallFailedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALL_FAILED, handler as any)
  }

  /**
   * Register handler for call.busy events
   * @param handler - Event handler function
   */
  onCallBusy(handler: (event: CallBusyEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALL_BUSY, handler as any)
  }

  /**
   * Register handler for call.no_answer events
   * @param handler - Event handler function
   */
  onCallNoAnswer(handler: (event: CallNoAnswerEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALL_NO_ANSWER, handler as any)
  }

  /**
   * Register handler for recording.available events
   * @param handler - Event handler function
   */
  onRecordingAvailable(handler: (event: RecordingAvailableEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RECORDING_AVAILABLE, handler as any)
  }

  /**
   * Register handler for recording.failed events
   * @param handler - Event handler function
   */
  onRecordingFailed(handler: (event: RecordingFailedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.RECORDING_FAILED, handler as any)
  }

  /**
   * Register handler for conference.start events
   * @param handler - Event handler function
   */
  onConferenceStart(handler: (event: ConferenceStartEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONFERENCE_START, handler as any)
  }

  /**
   * Register handler for conference.end events
   * @param handler - Event handler function
   */
  onConferenceEnd(handler: (event: ConferenceEndEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONFERENCE_END, handler as any)
  }

  /**
   * Register handler for conference.participant.join events
   * @param handler - Event handler function
   */
  onConferenceParticipantJoin(handler: (event: ConferenceParticipantJoinEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONFERENCE_PARTICIPANT_JOIN, handler as any)
  }

  /**
   * Register handler for conference.participant.leave events
   * @param handler - Event handler function
   */
  onConferenceParticipantLeave(handler: (event: ConferenceParticipantLeaveEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CONFERENCE_PARTICIPANT_LEAVE, handler as any)
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
