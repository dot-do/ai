/**
 * Text/SMS Service for SDK.do
 *
 * Provides methods for sending SMS messages, verification codes, and tracking delivery.
 * Integrates with SMS providers (Twilio, MessageBird, etc.) via the text API worker.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Send SMS
 * await $.text.send({
 *   to: '+1234567890',
 *   from: '+0987654321',
 *   body: 'Your order has been shipped!'
 * })
 *
 * // Send verification code
 * await $.text.sendVerification('+1234567890', {
 *   channel: 'sms',
 *   locale: 'en'
 * })
 *
 * // Check verification code
 * const result = await $.text.checkVerification('+1234567890', '123456')
 * console.log('Valid:', result.valid)
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SMSMessage {
  /**
   * Recipient phone number (E.164 format)
   */
  to: string

  /**
   * Sender phone number or alphanumeric sender ID
   */
  from: string

  /**
   * Message body (up to 1600 characters)
   */
  body: string

  /**
   * Media URLs for MMS (images, videos, etc.)
   */
  mediaUrls?: string[]

  /**
   * Status callback URL for delivery updates
   */
  statusCallback?: string

  /**
   * Custom metadata
   */
  metadata?: Record<string, any>

  /**
   * Scheduled send time (ISO 8601)
   */
  scheduledAt?: string

  /**
   * Validity period in seconds
   * @default 86400 (24 hours)
   */
  validityPeriod?: number
}

export interface SMSResult {
  /**
   * Unique message ID
   */
  messageId: string

  /**
   * Recipient phone number
   */
  to: string

  /**
   * Sender phone number
   */
  from: string

  /**
   * Message status
   */
  status: 'queued' | 'sent' | 'delivered' | 'failed'

  /**
   * Timestamp when message was queued
   */
  timestamp: string

  /**
   * Number of message segments
   */
  segments: number

  /**
   * Message cost (if available)
   */
  price?: {
    amount: string
    currency: string
  }

  /**
   * Provider-specific response
   */
  provider?: {
    name: string
    id: string
    response?: any
  }
}

export interface SMSBulkResult {
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
  results: SMSResult[]
}

export interface SMSStatus {
  /**
   * Message ID
   */
  messageId: string

  /**
   * Delivery status
   */
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered'

  /**
   * Recipient phone number
   */
  to: string

  /**
   * Status timestamp
   */
  timestamp: string

  /**
   * Error code (if failed)
   */
  errorCode?: string

  /**
   * Error message (if failed)
   */
  errorMessage?: string

  /**
   * Events history
   */
  events: Array<{
    status: string
    timestamp: string
  }>
}

export interface VerificationOptions {
  /**
   * Verification channel
   * @default 'sms'
   */
  channel?: 'sms' | 'voice' | 'whatsapp'

  /**
   * Code length (4-10 digits)
   * @default 6
   */
  codeLength?: number

  /**
   * Locale for message template
   * @default 'en'
   */
  locale?: string

  /**
   * Custom message template
   */
  customMessage?: string

  /**
   * App name to include in message
   */
  appName?: string

  /**
   * Code validity period in seconds
   * @default 300 (5 minutes)
   */
  validityPeriod?: number
}

export interface VerificationResult {
  /**
   * Verification ID
   */
  verificationId: string

  /**
   * Phone number
   */
  to: string

  /**
   * Channel used
   */
  channel: string

  /**
   * Status
   */
  status: 'pending' | 'approved' | 'expired' | 'failed'

  /**
   * Timestamp when verification was sent
   */
  timestamp: string

  /**
   * Code expires at
   */
  expiresAt: string
}

export interface VerificationCheckResult {
  /**
   * Verification ID
   */
  verificationId: string

  /**
   * Whether code is valid
   */
  valid: boolean

  /**
   * Verification status
   */
  status: 'approved' | 'pending' | 'expired' | 'failed'

  /**
   * Phone number
   */
  to: string

  /**
   * Timestamp of check
   */
  timestamp: string
}

export interface SMSReceivedEvent {
  messageId: string
  from: string
  to: string
  body: string
  timestamp: string
  mediaUrls?: string[]
}

export interface SMSDeliveredEvent {
  messageId: string
  to: string
  timestamp: string
  provider?: string
}

export interface SMSFailedEvent {
  messageId: string
  to: string
  timestamp: string
  errorCode: string
  errorMessage: string
}

export interface TextEventHandlers {
  received(handler: (event: SMSReceivedEvent) => void | Promise<void>): void
  delivered(handler: (event: SMSDeliveredEvent) => void | Promise<void>): void
  failed(handler: (event: SMSFailedEvent) => void | Promise<void>): void
}

// ============================================================================
// TEXT/SMS SERVICE
// ============================================================================

export class TextService {
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
   * Send an SMS message
   *
   * @param message - SMS message
   * @returns Send result with message ID
   *
   * @example
   * ```typescript
   * const result = await $.text.send({
   *   to: '+1234567890',
   *   from: '+0987654321',
   *   body: 'Your verification code is 123456'
   * })
   * console.log('Message ID:', result.messageId)
   * ```
   */
  async send(message: SMSMessage): Promise<SMSResult> {
    const response = await fetch(`${this.baseUrl}/v1/sms/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to send SMS: ${error}`)
    }

    return response.json() as Promise<SMSResult>
  }

  /**
   * Send bulk SMS messages
   *
   * @param messages - Array of SMS messages
   * @returns Bulk send result
   *
   * @example
   * ```typescript
   * const result = await $.text.sendBulk([
   *   {
   *     to: '+1234567890',
   *     from: '+0987654321',
   *     body: 'Sale starts now!'
   *   },
   *   {
   *     to: '+1234567891',
   *     from: '+0987654321',
   *     body: 'Sale starts now!'
   *   }
   * ])
   * console.log(`Sent ${result.successful}/${result.total} messages`)
   * ```
   */
  async sendBulk(messages: SMSMessage[]): Promise<SMSBulkResult> {
    const response = await fetch(`${this.baseUrl}/v1/sms/send/bulk`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to send bulk SMS: ${error}`)
    }

    return response.json() as Promise<SMSBulkResult>
  }

  /**
   * Send verification code
   *
   * @param phone - Phone number (E.164 format)
   * @param options - Verification options
   * @returns Verification result
   *
   * @example
   * ```typescript
   * const result = await $.text.sendVerification('+1234567890', {
   *   channel: 'sms',
   *   codeLength: 6,
   *   locale: 'en',
   *   appName: 'My App'
   * })
   * console.log('Verification ID:', result.verificationId)
   * console.log('Expires at:', result.expiresAt)
   * ```
   */
  async sendVerification(phone: string, options: VerificationOptions = {}): Promise<VerificationResult> {
    const response = await fetch(`${this.baseUrl}/v1/sms/verify/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        to: phone,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to send verification: ${error}`)
    }

    return response.json() as Promise<VerificationResult>
  }

  /**
   * Check verification code
   *
   * @param phone - Phone number (E.164 format)
   * @param code - Verification code entered by user
   * @returns Verification check result
   *
   * @example
   * ```typescript
   * const result = await $.text.checkVerification('+1234567890', '123456')
   * if (result.valid) {
   *   console.log('Verification successful!')
   * } else {
   *   console.log('Invalid code')
   * }
   * ```
   */
  async checkVerification(phone: string, code: string): Promise<VerificationCheckResult> {
    const response = await fetch(`${this.baseUrl}/v1/sms/verify/check`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        to: phone,
        code,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to check verification: ${error}`)
    }

    return response.json() as Promise<VerificationCheckResult>
  }

  /**
   * Get SMS delivery status
   *
   * @param messageId - Message ID
   * @returns SMS status
   *
   * @example
   * ```typescript
   * const status = await $.text.getStatus('msg_abc123')
   * console.log('Status:', status.status)
   * console.log('Events:', status.events)
   * ```
   */
  async getStatus(messageId: string): Promise<SMSStatus> {
    const response = await fetch(`${this.baseUrl}/v1/sms/status/${messageId}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get SMS status: ${response.statusText}`)
    }

    return response.json() as Promise<SMSStatus>
  }

  /**
   * Format phone number to E.164 format
   *
   * @param phone - Phone number
   * @param countryCode - Default country code (e.g., 'US')
   * @returns Formatted phone number
   *
   * @example
   * ```typescript
   * const formatted = $.text.formatPhone('(555) 123-4567', 'US')
   * // Returns: '+15551234567'
   * ```
   */
  formatPhone(phone: string, countryCode = 'US'): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')

    // If already has country code (starts with +), return as is
    if (phone.startsWith('+')) {
      return phone
    }

    // Common country codes
    const countryCodes: Record<string, string> = {
      US: '1',
      CA: '1',
      UK: '44',
      AU: '61',
      DE: '49',
      FR: '33',
      ES: '34',
      IT: '39',
      NL: '31',
      BE: '32',
      BR: '55',
      MX: '52',
      IN: '91',
      CN: '86',
      JP: '81',
    }

    const prefix = countryCodes[countryCode] || '1'

    // If number doesn't start with country code, add it
    if (!digits.startsWith(prefix)) {
      return `+${prefix}${digits}`
    }

    return `+${digits}`
  }

  /**
   * Validate phone number format
   *
   * @param phone - Phone number to validate
   * @returns True if valid E.164 format
   *
   * @example
   * ```typescript
   * const isValid = $.text.validatePhone('+1234567890')
   * console.log('Valid:', isValid)
   * ```
   */
  validatePhone(phone: string): boolean {
    // E.164 format: +[country code][number]
    // Max 15 digits total
    const e164Regex = /^\+[1-9]\d{1,14}$/
    return e164Regex.test(phone)
  }

  /**
   * Event handlers for webhook callbacks
   *
   * @example
   * ```typescript
   * $.text.on.received(async (event) => {
   *   console.log('SMS received from:', event.from)
   *   console.log('Message:', event.body)
   * })
   *
   * $.text.on.delivered(async (event) => {
   *   console.log('SMS delivered:', event.messageId)
   * })
   *
   * $.text.on.failed(async (event) => {
   *   console.log('SMS failed:', event.errorMessage)
   * })
   * ```
   */
  get on(): TextEventHandlers {
    const registerHandler = async (eventType: string, handler: Function): Promise<void> => {
      // Serialize handler function to string
      const handlerCode = handler.toString()

      // Register with API
      const response = await fetch(`${this.baseUrl}/v1/handlers/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          eventType: `sms.${eventType}`,
          handler: handlerCode,
          metadata: {
            registeredAt: new Date().toISOString(),
            description: `SMS ${eventType} handler`,
          },
        }),
      })

      if (!response.ok) {
        const error = (await response.json()) as any
        throw new Error(`Failed to register handler: ${error.error || error.message || response.statusText}`)
      }
    }

    return {
      received: (handler) => {
        registerHandler('received', handler)
      },
      delivered: (handler) => {
        registerHandler('delivered', handler)
      },
      failed: (handler) => {
        registerHandler('failed', handler)
      },
    }
  }
}

/**
 * Create text/SMS service instance
 */
export function createTextService(baseUrl?: string, apiKey?: string): TextService {
  return new TextService(baseUrl, apiKey)
}

/**
 * Default text/SMS service instance
 */
export const text = createTextService()
