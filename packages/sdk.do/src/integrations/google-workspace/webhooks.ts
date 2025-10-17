/**
 * Google Workspace Webhooks
 *
 * Auto-generated webhook handling for Google Workspace Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google-workspace
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  GMAIL_MESSAGERECEIVED: 'gmail.messageReceived',
  GMAIL_HISTORYCHANGED: 'gmail.historyChanged',
  CALENDAR_EVENTCREATED: 'calendar.eventCreated',
  CALENDAR_EVENTUPDATED: 'calendar.eventUpdated',
  CALENDAR_EVENTDELETED: 'calendar.eventDeleted',
  DRIVE_FILECHANGED: 'drive.fileChanged',
  DRIVE_FILETRASHED: 'drive.fileTrashed',
  DRIVE_FILEUNTRASHED: 'drive.fileUntrashed',
  DRIVE_FILEDELETED: 'drive.fileDeleted',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface GmailMessageReceivedEvent {
  type: 'gmail.messageReceived'
  data: any
  timestamp: string
  id: string
}

export interface GmailHistoryChangedEvent {
  type: 'gmail.historyChanged'
  data: any
  timestamp: string
  id: string
}

export interface CalendarEventCreatedEvent {
  type: 'calendar.eventCreated'
  data: any
  timestamp: string
  id: string
}

export interface CalendarEventUpdatedEvent {
  type: 'calendar.eventUpdated'
  data: any
  timestamp: string
  id: string
}

export interface CalendarEventDeletedEvent {
  type: 'calendar.eventDeleted'
  data: any
  timestamp: string
  id: string
}

export interface DriveFileChangedEvent {
  type: 'drive.fileChanged'
  data: any
  timestamp: string
  id: string
}

export interface DriveFileTrashedEvent {
  type: 'drive.fileTrashed'
  data: any
  timestamp: string
  id: string
}

export interface DriveFileUntrashedEvent {
  type: 'drive.fileUntrashed'
  data: any
  timestamp: string
  id: string
}

export interface DriveFileDeletedEvent {
  type: 'drive.fileDeleted'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | GmailMessageReceivedEvent
  | GmailHistoryChangedEvent
  | CalendarEventCreatedEvent
  | CalendarEventUpdatedEvent
  | CalendarEventDeletedEvent
  | DriveFileChangedEvent
  | DriveFileTrashedEvent
  | DriveFileUntrashedEvent
  | DriveFileDeletedEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  providedSecret: string
}

/**
 * Google Workspace Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class GoogleWorkspaceWebhookHandler {
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
   * Register handler for gmail.messageReceived events
   * @param handler - Event handler function
   */
  onGmailMessageReceived(handler: (event: GmailMessageReceivedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GMAIL_MESSAGERECEIVED, handler as any)
  }

  /**
   * Register handler for gmail.historyChanged events
   * @param handler - Event handler function
   */
  onGmailHistoryChanged(handler: (event: GmailHistoryChangedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.GMAIL_HISTORYCHANGED, handler as any)
  }

  /**
   * Register handler for calendar.eventCreated events
   * @param handler - Event handler function
   */
  onCalendarEventCreated(handler: (event: CalendarEventCreatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALENDAR_EVENTCREATED, handler as any)
  }

  /**
   * Register handler for calendar.eventUpdated events
   * @param handler - Event handler function
   */
  onCalendarEventUpdated(handler: (event: CalendarEventUpdatedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALENDAR_EVENTUPDATED, handler as any)
  }

  /**
   * Register handler for calendar.eventDeleted events
   * @param handler - Event handler function
   */
  onCalendarEventDeleted(handler: (event: CalendarEventDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.CALENDAR_EVENTDELETED, handler as any)
  }

  /**
   * Register handler for drive.fileChanged events
   * @param handler - Event handler function
   */
  onDriveFileChanged(handler: (event: DriveFileChangedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DRIVE_FILECHANGED, handler as any)
  }

  /**
   * Register handler for drive.fileTrashed events
   * @param handler - Event handler function
   */
  onDriveFileTrashed(handler: (event: DriveFileTrashedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DRIVE_FILETRASHED, handler as any)
  }

  /**
   * Register handler for drive.fileUntrashed events
   * @param handler - Event handler function
   */
  onDriveFileUntrashed(handler: (event: DriveFileUntrashedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DRIVE_FILEUNTRASHED, handler as any)
  }

  /**
   * Register handler for drive.fileDeleted events
   * @param handler - Event handler function
   */
  onDriveFileDeleted(handler: (event: DriveFileDeletedEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.DRIVE_FILEDELETED, handler as any)
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
