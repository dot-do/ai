/**
 * Call/Voice Service for SDK.do
 *
 * Provides methods for making voice calls, managing recordings, and transcriptions.
 * Integrates with voice providers (Twilio, Vonage, etc.) via the call API worker.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Make a voice call
 * const call = await $.call.make({
 *   to: '+1234567890',
 *   from: '+0987654321',
 *   url: 'https://example.com/voice/instructions.xml'
 * })
 *
 * // Get call status
 * const status = await $.call.getStatus(call.callId)
 * console.log('Status:', status.status)
 *
 * // Get recording
 * const recording = await $.call.getRecording(call.callId)
 * console.log('Recording URL:', recording.url)
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface CallParams {
  /**
   * Recipient phone number (E.164 format)
   */
  to: string

  /**
   * Caller phone number
   */
  from: string

  /**
   * TwiML/VXML URL for call instructions
   */
  url?: string

  /**
   * Text to speak (alternative to url)
   */
  message?: string

  /**
   * Voice to use for text-to-speech
   * @default 'en-US-Standard-A'
   */
  voice?: string

  /**
   * HTTP method for fetching url
   * @default 'POST'
   */
  method?: 'GET' | 'POST'

  /**
   * Status callback URL for call updates
   */
  statusCallback?: string

  /**
   * HTTP method for status callbacks
   * @default 'POST'
   */
  statusCallbackMethod?: 'GET' | 'POST'

  /**
   * Events to receive callbacks for
   */
  statusCallbackEvents?: Array<'initiated' | 'ringing' | 'answered' | 'completed'>

  /**
   * Call timeout in seconds
   * @default 60
   */
  timeout?: number

  /**
   * Record the call
   * @default false
   */
  record?: boolean

  /**
   * Recording channels
   * @default 'mono'
   */
  recordingChannels?: 'mono' | 'dual'

  /**
   * Recording status callback URL
   */
  recordingStatusCallback?: string

  /**
   * Transcribe the recording
   * @default false
   */
  transcribe?: boolean

  /**
   * Transcription callback URL
   */
  transcriptionCallback?: string

  /**
   * Machine detection
   * @default false
   */
  machineDetection?: boolean

  /**
   * Custom metadata
   */
  metadata?: Record<string, any>
}

export interface CallResult {
  /**
   * Unique call ID
   */
  callId: string

  /**
   * Recipient phone number
   */
  to: string

  /**
   * Caller phone number
   */
  from: string

  /**
   * Call status
   */
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'no-answer' | 'failed' | 'canceled'

  /**
   * Call direction
   */
  direction: 'inbound' | 'outbound'

  /**
   * Timestamp when call was initiated
   */
  timestamp: string

  /**
   * Call cost (if available)
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

export interface CallStatus {
  /**
   * Call ID
   */
  callId: string

  /**
   * Call status
   */
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'no-answer' | 'failed' | 'canceled'

  /**
   * Call direction
   */
  direction: 'inbound' | 'outbound'

  /**
   * Recipient phone number
   */
  to: string

  /**
   * Caller phone number
   */
  from: string

  /**
   * Call start time
   */
  startTime?: string

  /**
   * Call end time
   */
  endTime?: string

  /**
   * Call duration in seconds
   */
  duration?: number

  /**
   * Call answered by human or machine
   */
  answeredBy?: 'human' | 'machine' | 'unknown'

  /**
   * Events history
   */
  events: Array<{
    status: string
    timestamp: string
  }>
}

export interface CallRecording {
  /**
   * Recording ID
   */
  recordingId: string

  /**
   * Call ID
   */
  callId: string

  /**
   * Recording URL
   */
  url: string

  /**
   * Recording duration in seconds
   */
  duration: number

  /**
   * Recording channels
   */
  channels: 'mono' | 'dual'

  /**
   * Recording format
   */
  format: 'mp3' | 'wav' | 'ogg'

  /**
   * Recording created timestamp
   */
  createdAt: string

  /**
   * Recording file size in bytes
   */
  size?: number
}

export interface CallTranscript {
  /**
   * Transcript ID
   */
  transcriptId: string

  /**
   * Call ID
   */
  callId: string

  /**
   * Recording ID
   */
  recordingId: string

  /**
   * Transcript text
   */
  text: string

  /**
   * Transcript confidence score (0-1)
   */
  confidence: number

  /**
   * Transcript status
   */
  status: 'in-progress' | 'completed' | 'failed'

  /**
   * Transcript language
   */
  language?: string

  /**
   * Word-level timestamps
   */
  words?: Array<{
    word: string
    start: number
    end: number
    confidence: number
  }>

  /**
   * Transcript created timestamp
   */
  createdAt: string

  /**
   * Transcript completed timestamp
   */
  completedAt?: string
}

export interface CallInitiatedEvent {
  callId: string
  to: string
  from: string
  timestamp: string
}

export interface CallRingingEvent {
  callId: string
  to: string
  from: string
  timestamp: string
}

export interface CallAnsweredEvent {
  callId: string
  to: string
  from: string
  timestamp: string
  answeredBy?: 'human' | 'machine'
}

export interface CallCompletedEvent {
  callId: string
  to: string
  from: string
  timestamp: string
  duration: number
  status: 'completed' | 'busy' | 'no-answer' | 'failed' | 'canceled'
}

export interface CallRecordingEvent {
  callId: string
  recordingId: string
  url: string
  duration: number
  timestamp: string
}

export interface CallEventHandlers {
  initiated(handler: (event: CallInitiatedEvent) => void | Promise<void>): void
  ringing(handler: (event: CallRingingEvent) => void | Promise<void>): void
  answered(handler: (event: CallAnsweredEvent) => void | Promise<void>): void
  completed(handler: (event: CallCompletedEvent) => void | Promise<void>): void
  recording(handler: (event: CallRecordingEvent) => void | Promise<void>): void
}

// ============================================================================
// CALL/VOICE SERVICE
// ============================================================================

export class CallService {
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
   * Make a voice call
   *
   * @param params - Call parameters
   * @returns Call result with call ID
   *
   * @example
   * ```typescript
   * // Using TwiML URL
   * const call = await $.call.make({
   *   to: '+1234567890',
   *   from: '+0987654321',
   *   url: 'https://example.com/voice/greeting.xml',
   *   record: true,
   *   transcribe: true
   * })
   *
   * // Using text-to-speech
   * const call = await $.call.make({
   *   to: '+1234567890',
   *   from: '+0987654321',
   *   message: 'Hello! This is a reminder about your appointment tomorrow at 2 PM.',
   *   voice: 'en-US-Standard-A'
   * })
   * ```
   */
  async make(params: CallParams): Promise<CallResult> {
    const response = await fetch(`${this.baseUrl}/v1/voice/calls`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to make call: ${error}`)
    }

    return response.json() as Promise<CallResult>
  }

  /**
   * Get call status
   *
   * @param callId - Call ID
   * @returns Call status
   *
   * @example
   * ```typescript
   * const status = await $.call.getStatus('call_abc123')
   * console.log('Status:', status.status)
   * console.log('Duration:', status.duration)
   * console.log('Answered by:', status.answeredBy)
   * ```
   */
  async getStatus(callId: string): Promise<CallStatus> {
    const response = await fetch(`${this.baseUrl}/v1/voice/calls/${callId}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get call status: ${response.statusText}`)
    }

    return response.json() as Promise<CallStatus>
  }

  /**
   * Get call recording
   *
   * @param callId - Call ID
   * @returns Call recording information
   *
   * @example
   * ```typescript
   * const recording = await $.call.getRecording('call_abc123')
   * console.log('Recording URL:', recording.url)
   * console.log('Duration:', recording.duration)
   * ```
   */
  async getRecording(callId: string): Promise<CallRecording> {
    const response = await fetch(`${this.baseUrl}/v1/voice/calls/${callId}/recording`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get call recording: ${response.statusText}`)
    }

    return response.json() as Promise<CallRecording>
  }

  /**
   * Get call transcript
   *
   * @param callId - Call ID
   * @returns Call transcript
   *
   * @example
   * ```typescript
   * const transcript = await $.call.getTranscript('call_abc123')
   * console.log('Transcript:', transcript.text)
   * console.log('Confidence:', transcript.confidence)
   * console.log('Words:', transcript.words)
   * ```
   */
  async getTranscript(callId: string): Promise<CallTranscript> {
    const response = await fetch(`${this.baseUrl}/v1/voice/calls/${callId}/transcript`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get call transcript: ${response.statusText}`)
    }

    return response.json() as Promise<CallTranscript>
  }

  /**
   * Cancel/hangup an in-progress call
   *
   * @param callId - Call ID
   * @returns Updated call status
   *
   * @example
   * ```typescript
   * const status = await $.call.cancel('call_abc123')
   * console.log('Call canceled:', status.status === 'canceled')
   * ```
   */
  async cancel(callId: string): Promise<CallStatus> {
    const response = await fetch(`${this.baseUrl}/v1/voice/calls/${callId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to cancel call: ${response.statusText}`)
    }

    return response.json() as Promise<CallStatus>
  }

  /**
   * Update call in progress (redirect to new TwiML)
   *
   * @param callId - Call ID
   * @param url - New TwiML URL
   * @returns Updated call status
   *
   * @example
   * ```typescript
   * const status = await $.call.update('call_abc123', {
   *   url: 'https://example.com/voice/new-instructions.xml'
   * })
   * ```
   */
  async update(callId: string, params: { url: string; method?: 'GET' | 'POST' }): Promise<CallStatus> {
    const response = await fetch(`${this.baseUrl}/v1/voice/calls/${callId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Failed to update call: ${response.statusText}`)
    }

    return response.json() as Promise<CallStatus>
  }

  /**
   * Download recording as audio blob
   *
   * @param callId - Call ID
   * @returns Audio blob
   *
   * @example
   * ```typescript
   * const audio = await $.call.downloadRecording('call_abc123')
   * // Use the blob to play audio or save to file
   * ```
   */
  async downloadRecording(callId: string): Promise<Blob> {
    const recording = await this.getRecording(callId)

    const response = await fetch(recording.url, {
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`Failed to download recording: ${response.statusText}`)
    }

    return response.blob()
  }

  /**
   * List recent calls
   *
   * @param options - List options
   * @returns Array of call results
   *
   * @example
   * ```typescript
   * const calls = await $.call.list({
   *   limit: 20,
   *   status: 'completed',
   *   from: '+0987654321'
   * })
   * ```
   */
  async list(
    options: {
      limit?: number
      offset?: number
      status?: CallStatus['status']
      to?: string
      from?: string
      startDate?: string
      endDate?: string
    } = {}
  ): Promise<CallResult[]> {
    const params = new URLSearchParams()

    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())
    if (options.status) params.set('status', options.status)
    if (options.to) params.set('to', options.to)
    if (options.from) params.set('from', options.from)
    if (options.startDate) params.set('startDate', options.startDate)
    if (options.endDate) params.set('endDate', options.endDate)

    const response = await fetch(`${this.baseUrl}/v1/voice/calls?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to list calls: ${response.statusText}`)
    }

    const data = (await response.json()) as { calls: CallResult[] }
    return data.calls
  }

  /**
   * Event handlers for webhook callbacks
   *
   * @example
   * ```typescript
   * $.call.on.initiated(async (event) => {
   *   console.log('Call initiated:', event.callId)
   * })
   *
   * $.call.on.answered(async (event) => {
   *   console.log('Call answered:', event.answeredBy)
   * })
   *
   * $.call.on.completed(async (event) => {
   *   console.log('Call completed:', event.duration, 'seconds')
   * })
   *
   * $.call.on.recording(async (event) => {
   *   console.log('Recording available:', event.url)
   * })
   * ```
   */
  get on(): CallEventHandlers {
    const registerHandler = async (eventType: string, handler: Function): Promise<void> => {
      // Serialize handler function to string
      const handlerCode = handler.toString()

      // Register with API
      const response = await fetch(`${this.baseUrl}/v1/handlers/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          eventType: `voice.${eventType}`,
          handler: handlerCode,
          metadata: {
            registeredAt: new Date().toISOString(),
            description: `Voice ${eventType} handler`,
          },
        }),
      })

      if (!response.ok) {
        const error = (await response.json()) as any
        throw new Error(`Failed to register handler: ${error.error || error.message || response.statusText}`)
      }
    }

    return {
      initiated: (handler) => {
        registerHandler('initiated', handler)
      },
      ringing: (handler) => {
        registerHandler('ringing', handler)
      },
      answered: (handler) => {
        registerHandler('answered', handler)
      },
      completed: (handler) => {
        registerHandler('completed', handler)
      },
      recording: (handler) => {
        registerHandler('recording', handler)
      },
    }
  }
}

/**
 * Create call/voice service instance
 */
export function createCallService(baseUrl?: string, apiKey?: string): CallService {
  return new CallService(baseUrl, apiKey)
}

/**
 * Default call/voice service instance
 */
export const call = createCallService()
