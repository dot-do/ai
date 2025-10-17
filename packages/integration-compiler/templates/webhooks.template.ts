/**
 * Webhooks Template
 *
 * Handlebars template for generating webhooks.ts files.
 */

export const webhooksTemplate = `/**
 * {{serviceName}} Webhooks
 *
 * Auto-generated webhook handling for {{serviceName}} Integration.
 * Generated from MDXLD Integration definition.
 */

import { createHmac } from 'crypto'

{{#if events}}
/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  {{#each events}}
  {{constantCase name}}: '{{type}}',
  {{/each}}
} as const

export type WebhookEventType = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS]
{{/if}}

{{#if events}}
/**
 * Webhook event payload types
 */
{{#each events}}
export interface {{pascalCase name}}Event {
  type: '{{type}}'
  {{#if payloadSchema}}
  data: {{payloadSchema}}
  {{else}}
  data: any
  {{/if}}
  timestamp: string
  id: string
}

{{/each}}

export type WebhookEvent = {{#each events}}{{pascalCase name}}Event{{#unless @last}} | {{/unless}}{{/each}}
{{/if}}

/**
 * Webhook verification options
 */
export interface WebhookVerificationOptions {
  {{#if (eq verificationMethod 'signature')}}
  secret: string
  {{signatureHeader}}: string
  payload: string
  {{/if}}
  {{#if (eq verificationMethod 'secret')}}
  secret: string
  providedSecret: string
  {{/if}}
}

/**
 * {{serviceName}} Webhook Handler
 *
 * Handles webhook signature verification and event parsing.
 */
export class {{serviceName}}WebhookHandler {
  private secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  /**
   * Verify webhook signature
   *
   * @param options - Verification options
   * @returns True if signature is valid
   */
  verify(options: WebhookVerificationOptions): boolean {
    {{#if (eq verificationMethod 'signature')}}
    const expectedSignature = this.generateSignature(options.payload)
    return this.secureCompare(options.{{signatureHeader}}, expectedSignature)
    {{else if (eq verificationMethod 'secret')}}
    return this.secureCompare(options.providedSecret, this.secret)
    {{else}}
    // No verification method configured
    return true
    {{/if}}
  }

  {{#if (eq verificationMethod 'signature')}}
  /**
   * Generate webhook signature
   *
   * @param payload - Webhook payload
   * @returns HMAC signature
   */
  private generateSignature(payload: string): string {
    const hmac = createHmac('{{signatureAlgorithm}}', this.secret)
    hmac.update(payload)
    return hmac.digest('hex')
  }
  {{/if}}

  /**
   * Secure string comparison (timing-safe)
   *
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
   *
   * @param payload - Webhook payload string
   * @returns Parsed webhook event
   */
  parseEvent(payload: string): WebhookEvent {
    const event = JSON.parse(payload)

    // Validate event structure
    if (!event.type || !event.data) {
      throw new Error('Invalid webhook event structure')
    }

    return event as WebhookEvent
  }

  /**
   * Handle webhook request
   *
   * @param request - HTTP request
   * @returns Parsed webhook event
   * @throws Error if verification fails
   */
  async handleRequest(request: Request): Promise<WebhookEvent> {
    const payload = await request.text()
    {{#if (eq verificationMethod 'signature')}}
    const signature = request.headers.get('{{signatureHeader}}')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    if (!this.verify({ secret: this.secret, {{signatureHeader}}: signature, payload })) {
      throw new Error('Invalid webhook signature')
    }
    {{/if}}

    return this.parseEvent(payload)
  }
}

{{#if events}}
/**
 * Webhook Event Router
 *
 * Route webhook events to handlers based on event type.
 */
export class WebhookEventRouter {
  private handlers = new Map<string, (event: WebhookEvent) => Promise<void>>()

  /**
   * Register event handler
   *
   * @param eventType - Event type to handle
   * @param handler - Event handler function
   */
  on(eventType: WebhookEventType, handler: (event: WebhookEvent) => Promise<void>): void {
    this.handlers.set(eventType, handler)
  }

  {{#each events}}
  /**
   * Register handler for {{name}} events
   *
   * @param handler - Event handler function
   */
  on{{pascalCase name}}(handler: (event: {{pascalCase name}}Event) => Promise<void>): void {
    this.on(WEBHOOK_EVENTS.{{constantCase name}}, handler as any)
  }

  {{/each}}

  /**
   * Route event to appropriate handler
   *
   * @param event - Webhook event
   */
  async route(event: WebhookEvent): Promise<void> {
    const handler = this.handlers.get(event.type)

    if (!handler) {
      throw new Error(\`No handler registered for event type: \${event.type}\`)
    }

    await handler(event)
  }
}
{{/if}}
`
