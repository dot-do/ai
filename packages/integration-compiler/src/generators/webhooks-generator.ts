/**
 * Webhooks Generator
 *
 * Generate webhook handling code from Integration schema.
 */

import { Integration } from '../schema/integration.js'

/**
 * Webhooks Generator class
 *
 * Generates webhooks.ts files containing webhook signature verification,
 * event parsing, and event routing functionality.
 */
export class WebhooksGenerator {
  /**
   * Generate webhooks.ts from Integration definition
   *
   * @param integration - Integration definition
   * @returns Generated TypeScript code or null if webhooks not enabled
   */
  generate(integration: Integration): string | null {
    if (!integration.webhooks?.enabled) {
      return null
    }

    const sections: string[] = []

    // File header
    sections.push(this.generateHeader(integration))

    // Imports
    sections.push(this.generateImports())

    // Event types constants
    if (integration.webhooks.events.length > 0) {
      sections.push(this.generateEventConstants(integration))
    }

    // Event payload interfaces
    if (integration.webhooks.events.length > 0) {
      sections.push(this.generateEventInterfaces(integration))
    }

    // Verification options interface
    sections.push(this.generateVerificationOptions(integration))

    // Webhook handler class
    sections.push(this.generateWebhookHandler(integration))

    // Event router class
    if (integration.webhooks.events.length > 0) {
      sections.push(this.generateEventRouter(integration))
    }

    return sections.join('\n\n')
  }

  /**
   * Generate file header
   */
  private generateHeader(integration: Integration): string {
    return `/**
 * ${integration.name} Webhooks
 *
 * Auto-generated webhook handling for ${integration.name} Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see ${integration.$id}
 */`
  }

  /**
   * Generate imports
   */
  private generateImports(): string {
    return "import { createHmac } from 'crypto'"
  }

  /**
   * Generate event constants
   */
  private generateEventConstants(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(' * Webhook event types')
    lines.push(' */')
    lines.push('export const WEBHOOK_EVENTS = {')

    for (const event of integration.webhooks!.events) {
      lines.push(`  ${this.constantCase(event.name)}: '${event.type}',`)
    }

    lines.push('} as const')
    lines.push('')
    lines.push('export type WebhookEventType = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS]')

    return lines.join('\n')
  }

  /**
   * Generate event payload interfaces
   */
  private generateEventInterfaces(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(' * Webhook event payload types')
    lines.push(' */')

    for (const event of integration.webhooks!.events) {
      lines.push(`export interface ${this.pascalCase(event.name)}Event {`)
      lines.push(`  type: '${event.type}'`)
      lines.push(`  data: ${event.payloadSchema || 'any'}`)
      lines.push('  timestamp: string')
      lines.push('  id: string')
      lines.push('}')
      lines.push('')
    }

    // Union type
    const eventTypes = integration.webhooks!.events.map((e) => `${this.pascalCase(e.name)}Event`)
    lines.push(`export type WebhookEvent = ${eventTypes.join(' | ')}`)

    return lines.join('\n')
  }

  /**
   * Generate verification options interface
   */
  private generateVerificationOptions(integration: Integration): string {
    const lines: string[] = []
    const webhooks = integration.webhooks!

    lines.push('/**')
    lines.push(' * Webhook verification options')
    lines.push(' */')
    lines.push('export interface WebhookVerificationOptions {')

    if (webhooks.verificationMethod === 'signature') {
      lines.push('  secret: string')
      const headerName = webhooks.signatureHeader || 'signature'
      // Quote header names with dashes for valid TypeScript
      const quotedHeader = headerName.includes('-') ? `'${headerName}'` : headerName
      lines.push(`  ${quotedHeader}: string`)
      lines.push('  payload: string')
    } else if (webhooks.verificationMethod === 'secret') {
      lines.push('  secret: string')
      lines.push('  providedSecret: string')
    }

    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Generate webhook handler class
   */
  private generateWebhookHandler(integration: Integration): string {
    const lines: string[] = []
    const webhooks = integration.webhooks!

    lines.push('/**')
    lines.push(` * ${integration.name} Webhook Handler`)
    lines.push(' *')
    lines.push(' * Handles webhook signature verification and event parsing.')
    lines.push(' */')
    lines.push(`export class ${this.getServiceName(integration)}WebhookHandler {`)
    lines.push('  private secret: string')
    lines.push('')
    lines.push('  constructor(secret: string) {')
    lines.push('    this.secret = secret')
    lines.push('  }')

    // Verify method
    lines.push('')
    lines.push('  /**')
    lines.push('   * Verify webhook signature')
    lines.push('   * @param options - Verification options')
    lines.push('   * @returns True if signature is valid')
    lines.push('   */')
    lines.push('  verify(options: WebhookVerificationOptions): boolean {')

    if (webhooks.verificationMethod === 'signature') {
      lines.push('    const expectedSignature = this.generateSignature(options.payload)')
      const sigHeader = webhooks.signatureHeader || 'signature'
      // Use bracket notation for property names with dashes
      const accessor = sigHeader.includes('-') ? `['${sigHeader}']` : `.${sigHeader}`
      lines.push(`    return this.secureCompare(options${accessor}, expectedSignature)`)
    } else if (webhooks.verificationMethod === 'secret') {
      lines.push('    return this.secureCompare(options.providedSecret, this.secret)')
    } else {
      lines.push('    // No verification method configured')
      lines.push('    return true')
    }

    lines.push('  }')

    // Generate signature method
    if (webhooks.verificationMethod === 'signature') {
      lines.push('')
      lines.push('  /**')
      lines.push('   * Generate webhook signature')
      lines.push('   * @param payload - Webhook payload')
      lines.push('   * @returns HMAC signature')
      lines.push('   */')
      lines.push('  private generateSignature(payload: string): string {')
      lines.push(`    const hmac = createHmac('${webhooks.signatureAlgorithm || 'sha256'}', this.secret)`)
      lines.push('    hmac.update(payload)')
      lines.push("    return hmac.digest('hex')")
      lines.push('  }')
    }

    // Secure compare method
    lines.push('')
    lines.push('  /**')
    lines.push('   * Secure string comparison (timing-safe)')
    lines.push('   * @param a - First string')
    lines.push('   * @param b - Second string')
    lines.push('   * @returns True if strings match')
    lines.push('   */')
    lines.push('  private secureCompare(a: string, b: string): boolean {')
    lines.push('    if (a.length !== b.length) {')
    lines.push('      return false')
    lines.push('    }')
    lines.push('')
    lines.push('    let result = 0')
    lines.push('    for (let i = 0; i < a.length; i++) {')
    lines.push('      result |= a.charCodeAt(i) ^ b.charCodeAt(i)')
    lines.push('    }')
    lines.push('    return result === 0')
    lines.push('  }')

    // Parse event method
    lines.push('')
    lines.push('  /**')
    lines.push('   * Parse webhook event')
    lines.push('   * @param payload - Webhook payload string')
    lines.push('   * @returns Parsed webhook event')
    lines.push('   */')
    lines.push('  parseEvent(payload: string): WebhookEvent {')
    lines.push('    const event = JSON.parse(payload)')
    lines.push('')
    lines.push('    if (!event.type || !event.data) {')
    lines.push("      throw new Error('Invalid webhook event structure')")
    lines.push('    }')
    lines.push('')
    lines.push('    return event as WebhookEvent')
    lines.push('  }')

    // Handle request method
    lines.push('')
    lines.push('  /**')
    lines.push('   * Handle webhook request')
    lines.push('   * @param request - HTTP request')
    lines.push('   * @returns Parsed webhook event')
    lines.push('   * @throws Error if verification fails')
    lines.push('   */')
    lines.push('  async handleRequest(request: Request): Promise<WebhookEvent> {')
    lines.push('    const payload = await request.text()')

    if (webhooks.verificationMethod === 'signature') {
      const sigHeader = webhooks.signatureHeader || 'signature'
      lines.push(`    const signature = request.headers.get('${sigHeader}')`)
      lines.push('')
      lines.push('    if (!signature) {')
      lines.push("      throw new Error('Missing webhook signature')")
      lines.push('    }')
      lines.push('')
      // Quote property names with dashes in object literals
      const propertyName = sigHeader.includes('-') ? `'${sigHeader}'` : sigHeader
      lines.push(`    if (!this.verify({ secret: this.secret, ${propertyName}: signature, payload })) {`)
      lines.push("      throw new Error('Invalid webhook signature')")
      lines.push('    }')
    }

    lines.push('')
    lines.push('    return this.parseEvent(payload)')
    lines.push('  }')

    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Generate event router class
   */
  private generateEventRouter(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(' * Webhook Event Router')
    lines.push(' *')
    lines.push(' * Route webhook events to handlers based on event type.')
    lines.push(' */')
    lines.push('export class WebhookEventRouter {')
    lines.push('  private handlers = new Map<string, (event: WebhookEvent) => Promise<void>>()')
    lines.push('')
    lines.push('  /**')
    lines.push('   * Register event handler')
    lines.push('   * @param eventType - Event type to handle')
    lines.push('   * @param handler - Event handler function')
    lines.push('   */')
    lines.push('  on(eventType: WebhookEventType, handler: (event: WebhookEvent) => Promise<void>): void {')
    lines.push('    this.handlers.set(eventType, handler)')
    lines.push('  }')

    // Typed event handlers
    for (const event of integration.webhooks!.events) {
      lines.push('')
      lines.push('  /**')
      lines.push(`   * Register handler for ${event.name} events`)
      lines.push('   * @param handler - Event handler function')
      lines.push('   */')
      lines.push(`  on${this.pascalCase(event.name)}(handler: (event: ${this.pascalCase(event.name)}Event) => Promise<void>): void {`)
      lines.push(`    this.on(WEBHOOK_EVENTS.${this.constantCase(event.name)}, handler as any)`)
      lines.push('  }')
    }

    // Route method
    lines.push('')
    lines.push('  /**')
    lines.push('   * Route event to appropriate handler')
    lines.push('   * @param event - Webhook event')
    lines.push('   */')
    lines.push('  async route(event: WebhookEvent): Promise<void> {')
    lines.push('    const handler = this.handlers.get(event.type)')
    lines.push('')
    lines.push('    if (!handler) {')
    lines.push('      throw new Error(`No handler registered for event type: ${event.type}`)')
    lines.push('    }')
    lines.push('')
    lines.push('    await handler(event)')
    lines.push('  }')
    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Convert to PascalCase
   */
  private pascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }

  /**
   * Get service name for identifier usage (PascalCase)
   */
  private getServiceName(integration: Integration): string {
    return this.pascalCase(integration.service)
  }

  /**
   * Convert to CONSTANT_CASE
   */
  private constantCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()
  }
}
