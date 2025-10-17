/**
 * Email Service for SDK.do
 *
 * Provides methods for sending emails, managing templates, and tracking email delivery.
 * Integrates with email providers (SendGrid, Resend, etc.) via the email API worker.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Send email
 * await $.email.send({
 *   to: 'customer@example.com',
 *   from: 'support@example.com',
 *   subject: 'Welcome to our platform',
 *   html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>'
 * })
 *
 * // Send with template
 * await $.email.sendTemplate('welcome-email', 'customer@example.com', {
 *   name: 'John Doe',
 *   activationLink: 'https://example.com/activate/abc123'
 * })
 *
 * // Track delivery status
 * const status = await $.email.getStatus(messageId)
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface EmailMessage {
  /**
   * Recipient email address(es)
   */
  to: string | string[]

  /**
   * Sender email address
   */
  from: string

  /**
   * Email subject line
   */
  subject: string

  /**
   * Plain text content
   */
  text?: string

  /**
   * HTML content
   */
  html?: string

  /**
   * Reply-to email address
   */
  replyTo?: string

  /**
   * CC recipients
   */
  cc?: string | string[]

  /**
   * BCC recipients
   */
  bcc?: string | string[]

  /**
   * Email attachments
   */
  attachments?: EmailAttachment[]

  /**
   * Custom headers
   */
  headers?: Record<string, string>

  /**
   * Email tags for categorization
   */
  tags?: string[]

  /**
   * Custom metadata
   */
  metadata?: Record<string, any>

  /**
   * Scheduled send time (ISO 8601)
   */
  scheduledAt?: string

  /**
   * Track opens
   * @default true
   */
  trackOpens?: boolean

  /**
   * Track clicks
   * @default true
   */
  trackClicks?: boolean
}

export interface EmailAttachment {
  /**
   * Attachment filename
   */
  filename: string

  /**
   * File content (base64 encoded string, Buffer, or URL)
   */
  content: string | ArrayBuffer | Uint8Array

  /**
   * Content type (MIME type)
   */
  contentType?: string

  /**
   * Content disposition
   * @default 'attachment'
   */
  disposition?: 'attachment' | 'inline'

  /**
   * Content ID for inline images
   */
  contentId?: string
}

export interface EmailResult {
  /**
   * Unique message ID
   */
  messageId: string

  /**
   * Successfully accepted recipients
   */
  accepted: string[]

  /**
   * Rejected recipients
   */
  rejected: string[]

  /**
   * Timestamp when email was queued
   */
  timestamp: string

  /**
   * Provider-specific response
   */
  provider?: {
    name: string
    id: string
    response?: any
  }
}

export interface EmailBulkResult {
  /**
   * Total messages sent
   */
  total: number

  /**
   * Successfully sent messages
   */
  successful: number

  /**
   * Failed messages
   */
  failed: number

  /**
   * Individual results
   */
  results: EmailResult[]
}

export interface EmailTemplate {
  /**
   * Template ID
   */
  id: string

  /**
   * Template name
   */
  name: string

  /**
   * Template description
   */
  description?: string

  /**
   * Email subject (supports variables)
   */
  subject: string

  /**
   * HTML content (supports variables)
   */
  html: string

  /**
   * Plain text content (supports variables)
   */
  text?: string

  /**
   * Template variables
   */
  variables?: Array<{
    name: string
    description?: string
    required?: boolean
    defaultValue?: any
  }>

  /**
   * Template tags
   */
  tags?: string[]

  /**
   * Created timestamp
   */
  createdAt: string

  /**
   * Updated timestamp
   */
  updatedAt: string
}

export interface EmailStatus {
  /**
   * Message ID
   */
  messageId: string

  /**
   * Delivery status
   */
  status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'complained'

  /**
   * Recipient email
   */
  recipient: string

  /**
   * Status timestamp
   */
  timestamp: string

  /**
   * Bounce reason (if bounced)
   */
  bounceReason?: string

  /**
   * Error message (if failed)
   */
  error?: string

  /**
   * Events history
   */
  events: EmailEvent[]
}

export interface EmailEvent {
  /**
   * Event type
   */
  type: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed'

  /**
   * Event timestamp
   */
  timestamp: string

  /**
   * Additional event data
   */
  data?: any
}

export interface EmailTracking {
  /**
   * Message ID
   */
  messageId: string

  /**
   * Opens count
   */
  opens: number

  /**
   * Unique opens count
   */
  uniqueOpens: number

  /**
   * Clicks count
   */
  clicks: number

  /**
   * Unique clicks count
   */
  uniqueClicks: number

  /**
   * First opened timestamp
   */
  firstOpenedAt?: string

  /**
   * Last opened timestamp
   */
  lastOpenedAt?: string

  /**
   * Clicked links
   */
  clickedLinks?: Array<{
    url: string
    clicks: number
    firstClickedAt: string
    lastClickedAt: string
  }>

  /**
   * Geographic data
   */
  locations?: Array<{
    country: string
    city?: string
    count: number
  }>

  /**
   * Device data
   */
  devices?: Array<{
    type: string
    count: number
  }>
}

export interface EmailDeliveredEvent {
  messageId: string
  recipient: string
  timestamp: string
  provider?: string
}

export interface EmailBouncedEvent {
  messageId: string
  recipient: string
  timestamp: string
  bounceType: 'hard' | 'soft'
  reason: string
}

export interface EmailOpenedEvent {
  messageId: string
  recipient: string
  timestamp: string
  userAgent?: string
  ipAddress?: string
  location?: {
    country?: string
    city?: string
  }
}

export interface EmailClickedEvent {
  messageId: string
  recipient: string
  timestamp: string
  url: string
  userAgent?: string
  ipAddress?: string
}

export interface EmailComplaintEvent {
  messageId: string
  recipient: string
  timestamp: string
  complaintType: 'spam' | 'not-spam' | 'abuse'
}

export interface EmailEventHandlers {
  delivered(handler: (event: EmailDeliveredEvent) => void | Promise<void>): void
  bounced(handler: (event: EmailBouncedEvent) => void | Promise<void>): void
  opened(handler: (event: EmailOpenedEvent) => void | Promise<void>): void
  clicked(handler: (event: EmailClickedEvent) => void | Promise<void>): void
  complained(handler: (event: EmailComplaintEvent) => void | Promise<void>): void
}

// ============================================================================
// EMAIL SERVICE
// ============================================================================

export class EmailService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://api.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Send an email
   *
   * @param message - Email message
   * @returns Send result with message ID
   *
   * @example
   * ```typescript
   * const result = await $.email.send({
   *   to: 'customer@example.com',
   *   from: 'support@example.com',
   *   subject: 'Order Confirmation',
   *   html: '<h1>Your order has been confirmed!</h1>',
   *   trackOpens: true,
   *   trackClicks: true
   * })
   * console.log('Message ID:', result.messageId)
   * ```
   */
  async send(message: EmailMessage): Promise<EmailResult> {
    const response = await fetch(`${this.baseUrl}/v1/email/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to send email: ${error}`)
    }

    return response.json() as Promise<EmailResult>
  }

  /**
   * Send email using a template
   *
   * @param templateId - Template ID or name
   * @param to - Recipient email address
   * @param data - Template variables
   * @param options - Additional email options
   * @returns Send result with message ID
   *
   * @example
   * ```typescript
   * const result = await $.email.sendTemplate(
   *   'welcome-email',
   *   'newuser@example.com',
   *   {
   *     name: 'Jane Doe',
   *     activationLink: 'https://example.com/activate/xyz789'
   *   }
   * )
   * ```
   */
  async sendTemplate(
    templateId: string,
    to: string,
    data: Record<string, any>,
    options?: Partial<Omit<EmailMessage, 'to' | 'subject' | 'html' | 'text'>>
  ): Promise<EmailResult> {
    const response = await fetch(`${this.baseUrl}/v1/email/template/${templateId}/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        to,
        data,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to send template email: ${error}`)
    }

    return response.json() as Promise<EmailResult>
  }

  /**
   * Send bulk emails
   *
   * @param messages - Array of email messages
   * @returns Bulk send result
   *
   * @example
   * ```typescript
   * const result = await $.email.sendBulk([
   *   {
   *     to: 'customer1@example.com',
   *     from: 'support@example.com',
   *     subject: 'Newsletter',
   *     html: '<p>Check out our latest updates!</p>'
   *   },
   *   {
   *     to: 'customer2@example.com',
   *     from: 'support@example.com',
   *     subject: 'Newsletter',
   *     html: '<p>Check out our latest updates!</p>'
   *   }
   * ])
   * console.log(`Sent ${result.successful}/${result.total} emails`)
   * ```
   */
  async sendBulk(messages: EmailMessage[]): Promise<EmailBulkResult> {
    const response = await fetch(`${this.baseUrl}/v1/email/send/bulk`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to send bulk emails: ${error}`)
    }

    return response.json() as Promise<EmailBulkResult>
  }

  /**
   * Get email template
   *
   * @param id - Template ID or name
   * @returns Email template
   */
  async getTemplate(id: string): Promise<EmailTemplate> {
    const response = await fetch(`${this.baseUrl}/v1/email/templates/${id}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get template: ${response.statusText}`)
    }

    return response.json() as Promise<EmailTemplate>
  }

  /**
   * List email templates
   *
   * @returns Array of templates
   */
  async listTemplates(): Promise<EmailTemplate[]> {
    const response = await fetch(`${this.baseUrl}/v1/email/templates`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to list templates: ${response.statusText}`)
    }

    const data = (await response.json()) as { templates: EmailTemplate[] }
    return data.templates
  }

  /**
   * Get email delivery status
   *
   * @param messageId - Message ID
   * @returns Email status
   *
   * @example
   * ```typescript
   * const status = await $.email.getStatus('msg_abc123')
   * console.log('Status:', status.status)
   * console.log('Events:', status.events)
   * ```
   */
  async getStatus(messageId: string): Promise<EmailStatus> {
    const response = await fetch(`${this.baseUrl}/v1/email/status/${messageId}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get email status: ${response.statusText}`)
    }

    return response.json() as Promise<EmailStatus>
  }

  /**
   * Get email tracking information
   *
   * @param messageId - Message ID
   * @returns Email tracking data
   *
   * @example
   * ```typescript
   * const tracking = await $.email.track('msg_abc123')
   * console.log('Opens:', tracking.opens)
   * console.log('Clicks:', tracking.clicks)
   * console.log('Clicked links:', tracking.clickedLinks)
   * ```
   */
  async track(messageId: string): Promise<EmailTracking> {
    const response = await fetch(`${this.baseUrl}/v1/email/track/${messageId}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get email tracking: ${response.statusText}`)
    }

    return response.json() as Promise<EmailTracking>
  }

  /**
   * Event handlers for webhook callbacks
   *
   * @example
   * ```typescript
   * $.email.on.delivered(async (event) => {
   *   console.log('Email delivered:', event.messageId)
   * })
   *
   * $.email.on.bounced(async (event) => {
   *   console.log('Email bounced:', event.reason)
   * })
   *
   * $.email.on.opened(async (event) => {
   *   console.log('Email opened by:', event.recipient)
   * })
   * ```
   */
  get on(): EmailEventHandlers {
    const registerHandler = async (eventType: string, handler: Function): Promise<void> => {
      // Serialize handler function to string
      const handlerCode = handler.toString()

      // Register with API
      const response = await fetch(`${this.baseUrl}/v1/handlers/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          eventType: `email.${eventType}`,
          handler: handlerCode,
          metadata: {
            registeredAt: new Date().toISOString(),
            description: `Email ${eventType} handler`,
          },
        }),
      })

      if (!response.ok) {
        const error = (await response.json()) as any
        throw new Error(`Failed to register handler: ${error.error || error.message || response.statusText}`)
      }
    }

    return {
      delivered: (handler) => {
        registerHandler('delivered', handler)
      },
      bounced: (handler) => {
        registerHandler('bounced', handler)
      },
      opened: (handler) => {
        registerHandler('opened', handler)
      },
      clicked: (handler) => {
        registerHandler('clicked', handler)
      },
      complained: (handler) => {
        registerHandler('complained', handler)
      },
    }
  }
}

/**
 * Create email service instance
 */
export function createEmailService(baseUrl?: string, apiKey?: string): EmailService {
  return new EmailService(baseUrl, apiKey)
}

/**
 * Default email service instance
 */
export const email = createEmailService()
