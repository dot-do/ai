/**
 * Vapi Client for Multi-Channel Communication
 * Phase 3: VAPI Integration
 *
 * Provides SMS, voice call, and email capabilities via Vapi API
 * @see https://docs.vapi.ai
 *
 * ⚠️ WARNING: The in-memory rate limiter is NOT suitable for production
 * multi-instance deployments. Rate limits will reset on worker restarts.
 * For production, implement distributed rate limiting using Redis/Upstash/KV.
 */

import type { VapiConfig } from './types.js'

/**
 * Vapi API Client
 * Handles SMS, voice calls, and email via Vapi's API
 */
export class VapiClient {
  private baseUrl = 'https://api.vapi.ai'
  private apiKey: string
  private phoneNumber?: string
  private assistantId?: string

  constructor(config: VapiConfig & { apiKey: string }) {
    this.apiKey = config.apiKey
    this.phoneNumber = config.phoneNumber
    this.assistantId = config.assistantId

    if (!this.apiKey) {
      throw new Error('Vapi API key is required')
    }
  }

  /**
   * Make a Vapi API request with retry logic for transient failures
   */
  private async request<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    let lastError: Error | undefined

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          let errorMessage = errorText

          // Try to parse structured error response
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.message || errorJson.error || errorText
          } catch {
            // Use raw text if not JSON
          }

          const error = new Error(`Vapi API ${options.method || 'GET'} ${endpoint} failed (${response.status}): ${errorMessage}`)

          // Don't retry on 4xx errors (client errors)
          if (response.status >= 400 && response.status < 500) {
            throw error
          }

          // Retry on 5xx errors (server errors)
          lastError = error
          if (attempt < retries - 1) {
            const delay = Math.pow(2, attempt) * 1000 // Exponential backoff: 1s, 2s, 4s
            await new Promise((resolve) => setTimeout(resolve, delay))
            continue
          }
        }

        return (await response.json()) as T
      } catch (error) {
        lastError = error as Error
        // Retry on network errors
        if (attempt < retries - 1) {
          const delay = Math.pow(2, attempt) * 1000
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
      }
    }

    throw lastError || new Error(`Request failed after ${retries} attempts`)
  }

  /**
   * Send an SMS message
   * Rate limit: 10 per hour (default)
   * @see https://docs.vapi.ai/api-reference/messages/send
   */
  async sendSMS(params: { to: string; message: string }): Promise<VapiSMSResponse> {
    if (!this.phoneNumber) {
      throw new Error('Vapi phone number not configured')
    }

    // Validate E.164 phone number format (+[country code][number])
    if (!this.isValidE164PhoneNumber(params.to)) {
      throw new Error(`Invalid phone number format: ${params.to}. Must be E.164 format (e.g., +12345678900)`)
    }

    // Validate message length (SMS limit: 1600 chars for concatenated messages)
    if (params.message.length > 1600) {
      throw new Error('SMS message too long (max 1600 characters)')
    }

    return this.request<VapiSMSResponse>('/messages', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumberId: this.phoneNumber,
        to: params.to,
        message: params.message,
        type: 'sms',
      }),
    })
  }

  /**
   * Make a voice call
   * Rate limit: 5 per day (default)
   * @see https://docs.vapi.ai/api-reference/calls/create
   */
  async makeCall(params: { to: string; message: string; recordingEnabled?: boolean }): Promise<VapiCallResponse> {
    if (!this.assistantId) {
      throw new Error('Vapi assistant ID not configured')
    }

    // Validate E.164 phone number format
    if (!this.isValidE164PhoneNumber(params.to)) {
      throw new Error(`Invalid phone number format: ${params.to}. Must be E.164 format (e.g., +12345678900)`)
    }

    return this.request<VapiCallResponse>('/calls', {
      method: 'POST',
      body: JSON.stringify({
        assistantId: this.assistantId,
        phoneNumberId: this.phoneNumber,
        customer: {
          number: params.to,
        },
        // First message the assistant will say
        firstMessage: params.message,
        recordingEnabled: params.recordingEnabled ?? false,
      }),
    })
  }

  /**
   * Validate E.164 phone number format
   * Format: +[country code][number] (e.g., +12345678900)
   */
  private isValidE164PhoneNumber(phoneNumber: string): boolean {
    // E.164: + followed by 1-15 digits, starting with country code (1-9)
    return /^\+[1-9]\d{1,14}$/.test(phoneNumber)
  }

  /**
   * Send an email (via assistant integration)
   * ⚠️ NOT IMPLEMENTED: Email integration requires external service (SendGrid/Postmark)
   * @see https://docs.vapi.ai/integrations
   * @throws {Error} Always throws - email not implemented
   */
  async sendEmail(params: { to: string; subject: string; body: string }): Promise<VapiEmailResponse> {
    // Email is not directly supported by VAPI API
    // Requires integration with external email service (SendGrid, Postmark, etc.)
    throw new Error(
      'Email escalation not implemented. ' + 'Configure external email service (SendGrid/Postmark) or use P0/P1 priorities for SMS/voice escalation.'
    )
  }

  /**
   * Get call details and transcript
   * @see https://docs.vapi.ai/api-reference/calls/get
   */
  async getCall(callId: string): Promise<VapiCallDetails> {
    return this.request<VapiCallDetails>(`/calls/${callId}`)
  }

  /**
   * Get assistant details
   * @see https://docs.vapi.ai/api-reference/assistants/get
   */
  async getAssistant(assistantId?: string): Promise<VapiAssistant> {
    const id = assistantId || this.assistantId
    if (!id) {
      throw new Error('Assistant ID not provided')
    }
    return this.request<VapiAssistant>(`/assistants/${id}`)
  }
}

/**
 * Vapi API Response Types
 */
export interface VapiSMSResponse {
  id: string
  phoneNumberId: string
  to: string
  message: string
  status: 'queued' | 'sent' | 'delivered' | 'failed'
  createdAt: string
}

export interface VapiCallResponse {
  id: string
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed'
  assistantId: string
  phoneNumberId: string
  customer: {
    number: string
  }
  createdAt: string
  startedAt?: string
  endedAt?: string
}

export interface VapiCallDetails extends VapiCallResponse {
  transcript?: string
  recordingUrl?: string
  duration?: number
  cost?: number
}

export interface VapiEmailResponse {
  id: string
  status: 'queued' | 'sent' | 'delivered' | 'failed'
  to: string
  subject: string
  sentAt?: string
}

export interface VapiAssistant {
  id: string
  name: string
  model: string
  voice: string
  firstMessage?: string
  systemPrompt?: string
  tools?: Array<{
    type: string
    name: string
    description: string
  }>
}

/**
 * Rate Limiter for Vapi API
 * Enforces rate limits to prevent spam and excessive costs
 *
 * ⚠️ WARNING: This in-memory rate limiter is NOT suitable for production multi-instance deployments.
 * Rate limits will reset on worker restarts/redeployments. For production, use a distributed
 * rate limiter (e.g., @upstash/ratelimit with Redis, or Cloudflare KV).
 */
export class VapiRateLimiter {
  private smsTimestamps: number[] = []
  private callTimestamps: number[] = []

  constructor(
    private limits: {
      smsPerHour: number
      callsPerDay: number
    }
  ) {
    console.warn(
      '[vapi] Using in-memory rate limiter - not suitable for production multi-instance deployments. ' + 'Rate limits will reset on worker restarts.'
    )
  }

  /**
   * Check if SMS can be sent (within rate limit)
   * Cleans up old timestamps as a side effect
   */
  canSendSMS(): boolean {
    this.cleanupSMSTimestamps()
    return this.smsTimestamps.length < this.limits.smsPerHour
  }

  /**
   * Check if call can be made (within rate limit)
   * Cleans up old timestamps as a side effect
   */
  canMakeCall(): boolean {
    this.cleanupCallTimestamps()
    return this.callTimestamps.length < this.limits.callsPerDay
  }

  /**
   * Record SMS send and cleanup old timestamps
   */
  recordSMS(): void {
    // Prevent unbounded array growth (safety cap at 10x the limit)
    const MAX_TIMESTAMPS = this.limits.smsPerHour * 10
    if (this.smsTimestamps.length >= MAX_TIMESTAMPS) {
      console.error(`[vapi] SMS timestamp array at capacity (${MAX_TIMESTAMPS}), forcing cleanup`)
      this.cleanupSMSTimestamps()
      // If still at cap after cleanup, drop oldest timestamp
      if (this.smsTimestamps.length >= MAX_TIMESTAMPS) {
        this.smsTimestamps.shift()
      }
    }

    this.smsTimestamps.push(Date.now())
    this.cleanupSMSTimestamps() // Clean up immediately to prevent memory leak
    console.log(`[vapi] Recorded SMS (${this.smsTimestamps.length}/${this.limits.smsPerHour} used this hour)`)
  }

  /**
   * Record call made and cleanup old timestamps
   */
  recordCall(): void {
    // Prevent unbounded array growth (safety cap at 10x the limit)
    const MAX_TIMESTAMPS = this.limits.callsPerDay * 10
    if (this.callTimestamps.length >= MAX_TIMESTAMPS) {
      console.error(`[vapi] Call timestamp array at capacity (${MAX_TIMESTAMPS}), forcing cleanup`)
      this.cleanupCallTimestamps()
      // If still at cap after cleanup, drop oldest timestamp
      if (this.callTimestamps.length >= MAX_TIMESTAMPS) {
        this.callTimestamps.shift()
      }
    }

    this.callTimestamps.push(Date.now())
    this.cleanupCallTimestamps() // Clean up immediately to prevent memory leak
    console.log(`[vapi] Recorded call (${this.callTimestamps.length}/${this.limits.callsPerDay} used today)`)
  }

  /**
   * Get remaining SMS quota (pure read - no state mutation)
   */
  getRemainingSMS(): number {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    const validTimestamps = this.smsTimestamps.filter((ts) => ts > oneHourAgo)
    return Math.max(0, this.limits.smsPerHour - validTimestamps.length)
  }

  /**
   * Get remaining call quota (pure read - no state mutation)
   */
  getRemainingCalls(): number {
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const validTimestamps = this.callTimestamps.filter((ts) => ts > oneDayAgo)
    return Math.max(0, this.limits.callsPerDay - validTimestamps.length)
  }

  /**
   * Clean up old SMS timestamps (private helper)
   */
  private cleanupSMSTimestamps(): void {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    this.smsTimestamps = this.smsTimestamps.filter((ts) => ts > oneHourAgo)
  }

  /**
   * Clean up old call timestamps (private helper)
   */
  private cleanupCallTimestamps(): void {
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    this.callTimestamps = this.callTimestamps.filter((ts) => ts > oneDayAgo)
  }
}

/**
 * Escalation Manager
 * Handles escalation logic for blocking issues
 */
export interface EscalationContext {
  issueNumber: number
  title: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  author: string
  blockedSince?: string
  description: string
}

export class EscalationManager {
  constructor(
    private vapiClient: VapiClient,
    private rateLimiter: VapiRateLimiter,
    private emergencyContact: string
  ) {}

  /**
   * Escalate issue via appropriate channel based on priority
   */
  async escalate(context: EscalationContext): Promise<{ success: boolean; channel: string; message: string }> {
    const { priority, issueNumber, title, author } = context

    switch (priority) {
      case 'P0':
        // Critical: Immediate SMS + voice call
        return this.escalateP0(context)

      case 'P1':
        // High: SMS after 24h threshold
        return this.escalateP1(context)

      case 'P2':
      case 'P3':
        // Medium/Low: Email notification
        return this.escalateP2P3(context)

      default:
        throw new Error(`Unknown priority: ${priority}`)
    }
  }

  /**
   * P0 (Critical): Immediate SMS + voice call
   */
  private async escalateP0(context: EscalationContext): Promise<{ success: boolean; channel: string; message: string }> {
    const message = this.formatBlockingSMS(context)

    // Try SMS first
    if (this.rateLimiter.canSendSMS()) {
      let smsSuccess = false
      let voiceSuccess = false

      try {
        await this.vapiClient.sendSMS({
          to: this.emergencyContact,
          message,
        })
        this.rateLimiter.recordSMS()
        smsSuccess = true

        console.log(`[escalation] Sent P0 SMS for issue #${context.issueNumber}`)

        // Also try voice call if within rate limit
        if (this.rateLimiter.canMakeCall()) {
          try {
            await this.vapiClient.makeCall({
              to: this.emergencyContact,
              message: `Critical blocking issue #${context.issueNumber}: ${context.title}. Please check your messages.`,
            })
            this.rateLimiter.recordCall()
            voiceSuccess = true
            console.log(`[escalation] Made P0 voice call for issue #${context.issueNumber}`)
          } catch (error) {
            console.error(`[escalation] Voice call failed:`, error)
          }
        }

        return {
          success: smsSuccess,
          channel: voiceSuccess ? 'sms+voice' : 'sms',
          message: voiceSuccess ? 'Escalated via SMS and voice call' : 'Escalated via SMS only (voice call failed)',
        }
      } catch (error) {
        console.error(`[escalation] SMS failed:`, error)
        return {
          success: false,
          channel: 'sms',
          message: error instanceof Error ? error.message : 'SMS failed',
        }
      }
    } else {
      console.warn(`[escalation] SMS rate limit exceeded (${this.rateLimiter.getRemainingSMS()} remaining)`)
      return {
        success: false,
        channel: 'sms',
        message: 'SMS rate limit exceeded',
      }
    }
  }

  /**
   * P1 (High): SMS after 24h threshold
   */
  private async escalateP1(context: EscalationContext): Promise<{ success: boolean; channel: string; message: string }> {
    const message = this.formatBlockingSMS(context)

    if (this.rateLimiter.canSendSMS()) {
      try {
        await this.vapiClient.sendSMS({
          to: this.emergencyContact,
          message,
        })
        this.rateLimiter.recordSMS()
        console.log(`[escalation] Sent P1 SMS for issue #${context.issueNumber}`)
        return {
          success: true,
          channel: 'sms',
          message: 'Escalated via SMS',
        }
      } catch (error) {
        console.error(`[escalation] SMS failed:`, error)
        return {
          success: false,
          channel: 'sms',
          message: error instanceof Error ? error.message : 'SMS failed',
        }
      }
    } else {
      console.warn(`[escalation] SMS rate limit exceeded`)
      return {
        success: false,
        channel: 'sms',
        message: 'SMS rate limit exceeded',
      }
    }
  }

  /**
   * P2/P3 (Medium/Low): Email notification
   */
  private async escalateP2P3(context: EscalationContext): Promise<{ success: boolean; channel: string; message: string }> {
    try {
      await this.vapiClient.sendEmail({
        to: this.emergencyContact,
        subject: `Issue #${context.issueNumber} needs attention`,
        body: this.formatEscalationEmail(context),
      })
      console.log(`[escalation] Sent email for issue #${context.issueNumber}`)
      return {
        success: true,
        channel: 'email',
        message: 'Escalated via email',
      }
    } catch (error) {
      console.error(`[escalation] Email failed:`, error)
      return {
        success: false,
        channel: 'email',
        message: error instanceof Error ? error.message : 'Email failed',
      }
    }
  }

  /**
   * Format SMS message for blocking issues
   */
  private formatBlockingSMS(context: EscalationContext): string {
    const { priority, issueNumber, title } = context
    return `[${priority}] Blocking issue #${issueNumber}: ${title}. Please review on GitHub.`
  }

  /**
   * Format email for escalation
   */
  private formatEscalationEmail(context: EscalationContext): string {
    const { issueNumber, title, author, priority, description, blockedSince } = context

    return `
Issue #${issueNumber} requires attention

**Priority**: ${priority}
**Title**: ${title}
**Author**: @${author}
${blockedSince ? `**Blocked Since**: ${blockedSince}` : ''}

**Description**:
${description}

**Action Required**:
Please review this issue on GitHub and provide guidance to unblock progress.

View issue: https://github.com/dot-do/platform/issues/${issueNumber}

---
*Automated escalation by pdm agent (Dara)*
    `.trim()
  }
}
