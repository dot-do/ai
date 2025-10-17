/**
 * Box Webhooks
 *
 * Auto-generated webhook handling for Box Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/box
 */

import { createHmac } from 'crypto'

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  FILE_UPLOADED: 'FILE.UPLOADED',
  FILE_DOWNLOADED: 'FILE.DOWNLOADED',
  FILE_PREVIEWED: 'FILE.PREVIEWED',
  FILE_DELETED: 'FILE.DELETED',
  FILE_MOVED: 'FILE.MOVED',
  FILE_COPIED: 'FILE.COPIED',
  FILE_LOCKED: 'FILE.LOCKED',
  FILE_UNLOCKED: 'FILE.UNLOCKED',
  FOLDER_CREATED: 'FOLDER.CREATED',
  FOLDER_DELETED: 'FOLDER.DELETED',
} as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS]

/**
 * Webhook event payload types
 */
export interface FILEUPLOADEDEvent {
  type: 'FILE.UPLOADED'
  data: any
  timestamp: string
  id: string
}

export interface FILEDOWNLOADEDEvent {
  type: 'FILE.DOWNLOADED'
  data: any
  timestamp: string
  id: string
}

export interface FILEPREVIEWEDEvent {
  type: 'FILE.PREVIEWED'
  data: any
  timestamp: string
  id: string
}

export interface FILEDELETEDEvent {
  type: 'FILE.DELETED'
  data: any
  timestamp: string
  id: string
}

export interface FILEMOVEDEvent {
  type: 'FILE.MOVED'
  data: any
  timestamp: string
  id: string
}

export interface FILECOPIEDEvent {
  type: 'FILE.COPIED'
  data: any
  timestamp: string
  id: string
}

export interface FILELOCKEDEvent {
  type: 'FILE.LOCKED'
  data: any
  timestamp: string
  id: string
}

export interface FILEUNLOCKEDEvent {
  type: 'FILE.UNLOCKED'
  data: any
  timestamp: string
  id: string
}

export interface FOLDERCREATEDEvent {
  type: 'FOLDER.CREATED'
  data: any
  timestamp: string
  id: string
}

export interface FOLDERDELETEDEvent {
  type: 'FOLDER.DELETED'
  data: any
  timestamp: string
  id: string
}

export type WebhookEvent =
  | FILEUPLOADEDEvent
  | FILEDOWNLOADEDEvent
  | FILEPREVIEWEDEvent
  | FILEDELETEDEvent
  | FILEMOVEDEvent
  | FILECOPIEDEvent
  | FILELOCKEDEvent
  | FILEUNLOCKEDEvent
  | FOLDERCREATEDEvent
  | FOLDERDELETEDEvent

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  secret: string
  'BOX-SIGNATURE-PRIMARY': string
  payload: string
}

/**
 * Box Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class BoxWebhookHandler {
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
    return this.secureCompare(options['BOX-SIGNATURE-PRIMARY'], expectedSignature)
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
    const signature = request.headers.get('BOX-SIGNATURE-PRIMARY')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, 'BOX-SIGNATURE-PRIMARY': signature, payload })) {
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
   * Register handler for FILE_UPLOADED events
   * @param handler - Event handler function
   */
  onFILEUPLOADED(handler: (event: FILEUPLOADEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_UPLOADED, handler as any)
  }

  /**
   * Register handler for FILE_DOWNLOADED events
   * @param handler - Event handler function
   */
  onFILEDOWNLOADED(handler: (event: FILEDOWNLOADEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_DOWNLOADED, handler as any)
  }

  /**
   * Register handler for FILE_PREVIEWED events
   * @param handler - Event handler function
   */
  onFILEPREVIEWED(handler: (event: FILEPREVIEWEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_PREVIEWED, handler as any)
  }

  /**
   * Register handler for FILE_DELETED events
   * @param handler - Event handler function
   */
  onFILEDELETED(handler: (event: FILEDELETEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_DELETED, handler as any)
  }

  /**
   * Register handler for FILE_MOVED events
   * @param handler - Event handler function
   */
  onFILEMOVED(handler: (event: FILEMOVEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_MOVED, handler as any)
  }

  /**
   * Register handler for FILE_COPIED events
   * @param handler - Event handler function
   */
  onFILECOPIED(handler: (event: FILECOPIEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_COPIED, handler as any)
  }

  /**
   * Register handler for FILE_LOCKED events
   * @param handler - Event handler function
   */
  onFILELOCKED(handler: (event: FILELOCKEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_LOCKED, handler as any)
  }

  /**
   * Register handler for FILE_UNLOCKED events
   * @param handler - Event handler function
   */
  onFILEUNLOCKED(handler: (event: FILEUNLOCKEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FILE_UNLOCKED, handler as any)
  }

  /**
   * Register handler for FOLDER_CREATED events
   * @param handler - Event handler function
   */
  onFOLDERCREATED(handler: (event: FOLDERCREATEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FOLDER_CREATED, handler as any)
  }

  /**
   * Register handler for FOLDER_DELETED events
   * @param handler - Event handler function
   */
  onFOLDERDELETED(handler: (event: FOLDERDELETEDEvent) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.FOLDER_DELETED, handler as any)
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
