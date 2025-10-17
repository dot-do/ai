/**
 * errors.do SDK - Error tracking and monitoring client library
 *
 * This SDK provides a type-safe client for error tracking, reporting, and monitoring.
 * It supports batch error reporting, error context, stack traces, and user tracking
 * for comprehensive error analysis and debugging.
 *
 * SECURITY & PRIVACY NOTES:
 * - User emails are sent in plain text headers. Consider hashing sensitive data before
 *   calling setUser() if intermediary proxies/CDNs might log headers.
 * - No built-in rate limiting. To prevent accidental DOS of the error service, implement
 *   rate limiting in your application layer or configure maxQueueSize to limit memory usage.
 * - Queue size limit (maxQueueSize) prevents unbounded memory growth but drops oldest errors
 *   when exceeded. Consider implementing sampling for high-volume error scenarios.
 */

export interface ErrorClientConfig {
  baseUrl?: string
  apiKey?: string
  timeout?: number
  headers?: Record<string, string>
  environment?: string
  release?: string
  enableAutoCapture?: boolean
  batchSize?: number
  flushInterval?: number
  maxQueueSize?: number
  maxBreadcrumbs?: number
  maxRetries?: number
  debug?: boolean
}

export interface ErrorContext {
  user?: {
    id?: string
    email?: string
    username?: string
    [key: string]: unknown
  }
  tags?: Record<string, string>
  extra?: Record<string, unknown>
  breadcrumbs?: Breadcrumb[]
  request?: {
    url?: string
    method?: string
    headers?: Record<string, string>
    body?: unknown
    query?: Record<string, string>
  }
  device?: {
    name?: string
    brand?: string
    model?: string
    os?: string
    osVersion?: string
    browser?: string
    browserVersion?: string
  }
}

export interface Breadcrumb {
  timestamp: number
  category: string
  message: string
  level?: 'debug' | 'info' | 'warning' | 'error'
  data?: Record<string, unknown>
}

export interface ErrorTrackingEvent {
  id?: string
  timestamp: number
  message: string
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal'
  exception?: {
    type?: string
    value: string
    stacktrace?: StackFrame[]
  }
  context?: ErrorContext
  environment?: string
  release?: string
  fingerprint?: string[]
}

export interface StackFrame {
  filename?: string
  function?: string
  lineno?: number
  colno?: number
  absPath?: string
  contextLine?: string
  preContext?: string[]
  postContext?: string[]
  inApp?: boolean
}

export interface ErrorStats {
  total: number
  byLevel: Record<string, number>
  byEnvironment: Record<string, number>
  recentErrors: ErrorTrackingEvent[]
}

export interface ErrorGroup {
  id: string
  fingerprint: string
  message: string
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal'
  count: number
  firstSeen: number
  lastSeen: number
  environments: string[]
  releases: string[]
}

export class ErrorClient {
  private baseUrl: string
  private apiKey?: string
  private timeout: number
  private headers: Record<string, string>
  private environment: string
  private release?: string
  private enableAutoCapture: boolean
  private batchSize: number
  private flushInterval: number
  private errorQueue: ErrorTrackingEvent[] = []
  private flushTimer?: NodeJS.Timeout
  private breadcrumbs: Breadcrumb[] = []
  private maxBreadcrumbs: number
  private errorRetries: Map<string, number> = new Map()
  private maxRetries: number
  private maxQueueSize: number
  private isFlushScheduled: boolean = false
  private isFlushing: boolean = false
  private isCapturingError: boolean = false
  private debug: boolean
  private errorListener?: (event: ErrorEvent) => void
  private rejectionListener?: (event: PromiseRejectionEvent) => void

  constructor(config: ErrorClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://errors.do'
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 10000
    this.environment = config.environment || 'production'
    this.release = config.release
    this.enableAutoCapture = config.enableAutoCapture ?? true
    this.batchSize = config.batchSize || 50
    this.flushInterval = config.flushInterval || 5000
    this.maxQueueSize = config.maxQueueSize || 1000
    this.maxBreadcrumbs = config.maxBreadcrumbs || 100
    this.maxRetries = config.maxRetries || 3
    this.debug = config.debug || false

    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    if (this.apiKey) {
      this.headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    if (this.enableAutoCapture && typeof window !== 'undefined') {
      this.setupAutoCapture()
    }
  }

  /**
   * Capture an error
   */
  async captureError(error: Error | string, context?: ErrorContext): Promise<string> {
    const errorEvent = this.createErrorEvent(error, 'error', context)
    return this.capture(errorEvent)
  }

  /**
   * Capture an exception
   */
  async captureException(error: Error, context?: ErrorContext): Promise<string> {
    const errorEvent = this.createErrorEvent(error, 'error', context)
    return this.capture(errorEvent)
  }

  /**
   * Capture a message
   */
  async captureMessage(message: string, level: ErrorTrackingEvent['level'] = 'info', context?: ErrorContext): Promise<string> {
    const errorEvent = this.createErrorEvent(message, level, context)
    return this.capture(errorEvent)
  }

  /**
   * Capture an event
   */
  async capture(event: ErrorTrackingEvent): Promise<string> {
    // Check queue size limit and drop oldest if exceeded
    if (this.errorQueue.length >= this.maxQueueSize) {
      const dropped = this.errorQueue.shift()
      if (this.debug) {
        console.warn(`Error queue size limit (${this.maxQueueSize}) exceeded, dropping oldest error: ${dropped?.id}`)
      }
    }

    // Add to queue for batching
    this.errorQueue.push(event)

    // Flush if batch size reached
    if (this.errorQueue.length >= this.batchSize) {
      await this.flush()
    } else {
      // Schedule flush
      this.scheduleFlush()
    }

    return event.id || this.generateId()
  }

  /**
   * Flush queued errors with retry limits to prevent infinite loops
   */
  async flush(): Promise<void> {
    if (this.errorQueue.length === 0 || this.isFlushing) {
      return
    }

    // Set flushing flag to prevent race conditions
    this.isFlushing = true

    // Clear flush timer and reset scheduled flag
    if (this.flushTimer) {
      clearTimeout(this.flushTimer)
      this.flushTimer = undefined
    }
    this.isFlushScheduled = false

    const errors = [...this.errorQueue]
    this.errorQueue = []

    try {
      await this.fetch('/errors/batch', {
        method: 'POST',
        body: JSON.stringify({ errors }),
      })
      // Clear retry counts on success
      for (const error of errors) {
        if (error.id) {
          this.errorRetries.delete(error.id)
        }
      }
    } catch (error) {
      // Only re-queue errors that haven't exceeded retry limit
      const retriableErrors = errors.filter((err) => {
        if (!err.id) return false
        const retries = this.errorRetries.get(err.id) || 0
        if (retries >= this.maxRetries) {
          if (this.debug) {
            console.warn(`Error ${err.id} exceeded max retries (${this.maxRetries}), dropping`)
          }
          this.errorRetries.delete(err.id)
          return false
        }
        this.errorRetries.set(err.id, retries + 1)
        return true
      })

      // Re-queue at the end to avoid race conditions with new captures
      if (retriableErrors.length > 0) {
        this.errorQueue.push(...retriableErrors)
      }
      throw error
    } finally {
      this.isFlushing = false
    }
  }

  /**
   * Add a breadcrumb to track user actions and events
   * Breadcrumbs provide context about what happened before an error occurred
   * @param breadcrumb - The breadcrumb to add (timestamp is added automatically)
   */
  addBreadcrumb(breadcrumb: Omit<Breadcrumb, 'timestamp'>): void {
    this.breadcrumbs.push({
      timestamp: Date.now(),
      ...breadcrumb,
    })

    // Keep only the last N breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs)
    }
  }

  /**
   * Set user context for all subsequent error reports
   * User information is included in request headers
   * @param user - User information including id, email, and username
   *
   * PRIVACY NOTE: User email is sent in plain text in headers. Consider hashing sensitive
   * data before passing to this method if the error tracking service or intermediary
   * proxies/CDNs might log headers.
   */
  setUser(user: ErrorContext['user']): void {
    // Validate user object to prevent prototype pollution and DoS
    if (!user || typeof user !== 'object') {
      return
    }

    // Validate key properties exist and are strings
    const id = typeof user.id === 'string' ? user.id : ''
    const email = typeof user.email === 'string' ? user.email : ''

    // Limit length to prevent DoS with large values
    const maxLength = 1000
    this.headers['X-User-Id'] = this.sanitizeHeaderValue(id.substring(0, maxLength))
    this.headers['X-User-Email'] = this.sanitizeHeaderValue(email.substring(0, maxLength))
  }

  /**
   * Set tags for categorizing and filtering errors
   * Tags are included in request headers as JSON
   * @param tags - Key-value pairs for tagging errors (e.g., component, version)
   */
  setTags(tags: Record<string, string>): void {
    // Sanitize tag values before stringifying
    const sanitizedTags: Record<string, string> = {}
    for (const [key, value] of Object.entries(tags)) {
      sanitizedTags[key] = this.sanitizeHeaderValue(value)
    }
    this.headers['X-Tags'] = JSON.stringify(sanitizedTags)
  }

  /**
   * Sanitize header values to prevent invalid characters
   * Removes newlines, carriage returns, and other control characters
   */
  private sanitizeHeaderValue(value: string): string {
    // Remove control characters and newlines that could break headers
    return value.replace(/[\r\n\x00-\x1F\x7F]/g, '')
  }

  /**
   * Retrieve a specific error by its unique ID
   * @param id - The error ID to retrieve
   * @returns The error event if found, null if not found
   */
  async getError(id: string): Promise<ErrorTrackingEvent | null> {
    const response = await this.fetch(`/errors/${id}`)
    if (response.status === 404) return null
    return response.json() as Promise<ErrorTrackingEvent>
  }

  /**
   * List errors with optional filtering and pagination
   * @param options - Filtering options including limit, offset, level, environment, release, and date range
   * @returns Paginated list of errors with total count
   */
  async listErrors(options: {
    limit?: number
    offset?: number
    level?: ErrorTrackingEvent['level']
    environment?: string
    release?: string
    startDate?: number
    endDate?: number
  } = {}): Promise<{ errors: ErrorTrackingEvent[]; total: number }> {
    const params = new URLSearchParams()
    if (options.limit) params.set('limit', String(options.limit))
    if (options.offset) params.set('offset', String(options.offset))
    if (options.level) params.set('level', options.level)
    if (options.environment) params.set('environment', options.environment)
    if (options.release) params.set('release', options.release)
    if (options.startDate) params.set('startDate', String(options.startDate))
    if (options.endDate) params.set('endDate', String(options.endDate))

    const url = `/errors?${params}`
    const response = await this.fetch(url)
    return response.json() as Promise<{ errors: ErrorTrackingEvent[]; total: number }>
  }

  /**
   * Get grouped errors with the same fingerprint
   * Errors are grouped by their fingerprint for easier management
   * @param options - Filtering options including limit, offset, and environment
   * @returns Paginated list of error groups with total count
   */
  async getErrorGroups(options: {
    limit?: number
    offset?: number
    environment?: string
  } = {}): Promise<{ groups: ErrorGroup[]; total: number }> {
    const params = new URLSearchParams()
    if (options.limit) params.set('limit', String(options.limit))
    if (options.offset) params.set('offset', String(options.offset))
    if (options.environment) params.set('environment', options.environment)

    const url = `/errors/groups?${params}`
    const response = await this.fetch(url)
    return response.json() as Promise<{ groups: ErrorGroup[]; total: number }>
  }

  /**
   * Get error statistics and metrics
   * @param options - Filtering options including environment and date range
   * @returns Error statistics including total, by level, by environment, and recent errors
   */
  async getStats(options: {
    environment?: string
    startDate?: number
    endDate?: number
  } = {}): Promise<ErrorStats> {
    const params = new URLSearchParams()
    if (options.environment) params.set('environment', options.environment)
    if (options.startDate) params.set('startDate', String(options.startDate))
    if (options.endDate) params.set('endDate', String(options.endDate))

    const url = `/errors/stats?${params}`
    const response = await this.fetch(url)
    return response.json() as Promise<ErrorStats>
  }

  /**
   * Mark an error group as resolved
   * @param fingerprint - The fingerprint of the error group to resolve
   */
  async resolveGroup(fingerprint: string): Promise<void> {
    await this.fetch(`/errors/groups/${fingerprint}/resolve`, {
      method: 'POST',
    })
  }

  /**
   * Delete a specific error by ID
   * @param id - The error ID to delete
   */
  async deleteError(id: string): Promise<void> {
    await this.fetch(`/errors/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Check the health status of the error tracking service
   * @returns Health status and timestamp
   */
  async health(): Promise<{ status: string; timestamp: number }> {
    const response = await this.fetch('/health')
    return response.json() as Promise<{ status: string; timestamp: number }>
  }

  /**
   * Close the client, cleanup event listeners, and flush remaining errors
   * Should be called when shutting down to ensure all errors are sent
   */
  async close(): Promise<void> {
    // Remove event listeners to prevent memory leaks
    if (typeof window !== 'undefined') {
      if (this.errorListener) {
        window.removeEventListener('error', this.errorListener)
        this.errorListener = undefined
      }
      if (this.rejectionListener) {
        window.removeEventListener('unhandledrejection', this.rejectionListener)
        this.rejectionListener = undefined
      }
    }

    await this.flush()
    if (this.flushTimer) {
      clearTimeout(this.flushTimer)
      this.flushTimer = undefined
    }
  }

  /**
   * Create an error event from an error or message
   */
  private createErrorEvent(error: Error | string, level: ErrorTrackingEvent['level'], context?: ErrorContext): ErrorTrackingEvent {
    const timestamp = Date.now()
    const id = this.generateId()

    let message: string
    let exception: ErrorTrackingEvent['exception'] | undefined

    if (error instanceof Error) {
      message = error.message || 'Unknown error'
      exception = {
        type: error.name || 'Error',
        value: error.message || 'Unknown error',
        stacktrace: this.parseStackTrace(error.stack),
      }
    } else {
      message = error || 'Unknown error'
    }

    // Generate fingerprint for grouping
    const fingerprint = this.generateFingerprint(message, exception)

    return {
      id,
      timestamp,
      message,
      level,
      exception,
      context: {
        ...context,
        breadcrumbs: [...this.breadcrumbs, ...(context?.breadcrumbs || [])],
      },
      environment: this.environment,
      release: this.release,
      fingerprint: [fingerprint],
    }
  }

  /**
   * Parse stack trace from V8 (Chrome/Node), Firefox, and Safari formats
   *
   * Supported formats:
   * - V8: "at functionName (file.js:10:5)" or "at file.js:10:5"
   * - Firefox: "functionName@file.js:10:5"
   * - Safari: "functionName@file.js:10:5" or "file.js:10:5"
   */
  private parseStackTrace(stack?: string): StackFrame[] | undefined {
    if (!stack) return undefined

    const frames: StackFrame[] = []
    const lines = stack.split('\n')

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      let functionName: string | undefined
      let filename: string | undefined
      let lineno: number | undefined
      let colno: number | undefined

      // Try V8 format first: "at functionName (file.js:10:5)" or "at file.js:10:5"
      const v8Match = trimmedLine.match(/at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?)\)?/)
      if (v8Match) {
        functionName = v8Match[1]
        filename = v8Match[2]
        lineno = v8Match[3] ? parseInt(v8Match[3], 10) : undefined
        colno = v8Match[4] ? parseInt(v8Match[4], 10) : undefined
      } else {
        // Try Firefox/Safari format: "functionName@file.js:10:5"
        const firefoxMatch = trimmedLine.match(/^(?:(.+?)@)?(.+?):(\d+)(?::(\d+))?$/)
        if (firefoxMatch) {
          functionName = firefoxMatch[1]
          filename = firefoxMatch[2]
          lineno = firefoxMatch[3] ? parseInt(firefoxMatch[3], 10) : undefined
          colno = firefoxMatch[4] ? parseInt(firefoxMatch[4], 10) : undefined
        }
      }

      if (filename) {
        frames.push({
          function: functionName?.trim() || undefined,
          filename,
          lineno,
          colno,
          inApp: !filename.includes('node_modules'),
        })
      }
    }

    return frames.length > 0 ? frames : undefined
  }

  /**
   * Generate fingerprint for error grouping
   * Includes top stack frames and uses simple hash for better collision resistance
   */
  private generateFingerprint(message: string, exception?: ErrorTrackingEvent['exception']): string {
    const parts = [message, exception?.type, exception?.value]

    // Include top 3 stack frames for better grouping
    if (exception?.stacktrace && exception.stacktrace.length > 0) {
      const topFrames = exception.stacktrace.slice(0, 3)
      for (const frame of topFrames) {
        if (frame.filename && frame.lineno) {
          parts.push(`${frame.filename}:${frame.lineno}`)
        }
      }
    }

    const fingerprint = parts.filter(Boolean).join('::')

    // Generate a simple hash for better collision resistance
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }

    return `${Math.abs(hash).toString(36)}-${fingerprint.substring(0, 100)}`
  }

  /**
   * Generate unique ID using crypto.randomUUID() for better security
   */
  private generateId(): string {
    // Use crypto.randomUUID() if available (browser/Node 19+)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    // Fallback for older environments
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Schedule flush with race condition protection
   */
  private scheduleFlush(): void {
    // Prevent scheduling multiple flushes
    if (this.isFlushScheduled) {
      return
    }

    this.isFlushScheduled = true

    // Clear existing timer to prevent memory leaks
    if (this.flushTimer) {
      clearTimeout(this.flushTimer)
    }

    this.flushTimer = setTimeout(() => {
      this.isFlushScheduled = false
      this.flush().catch((error) => {
        // Reset flag in case of error to allow future flushes
        this.isFlushScheduled = false
        if (this.debug) {
          console.error('Failed to flush errors:', error)
        }
      })
    }, this.flushInterval)
  }

  /**
   * Setup automatic error capture with circuit breaker to prevent infinite loops
   */
  private setupAutoCapture(): void {
    // Capture unhandled errors
    if (typeof window !== 'undefined') {
      this.errorListener = (event: ErrorEvent) => {
        // Circuit breaker: prevent infinite loop if capturing errors fails
        if (this.isCapturingError) {
          return
        }
        this.isCapturingError = true
        this.captureException(event.error || new Error(event.message))
          .catch((err) => {
            // Use console.warn instead of console.error to avoid triggering error handler
            if (this.debug) {
              console.warn('Failed to capture error:', err)
            }
          })
          .finally(() => {
            this.isCapturingError = false
          })
      }
      window.addEventListener('error', this.errorListener)

      // Capture unhandled promise rejections
      this.rejectionListener = (event: PromiseRejectionEvent) => {
        // Circuit breaker: prevent infinite loop if capturing errors fails
        if (this.isCapturingError) {
          return
        }
        this.isCapturingError = true
        const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
        this.captureException(error)
          .catch((err) => {
            // Use console.warn instead of console.error to avoid triggering error handler
            if (this.debug) {
              console.warn('Failed to capture promise rejection:', err)
            }
          })
          .finally(() => {
            this.isCapturingError = false
          })
      }
      window.addEventListener('unhandledrejection', this.rejectionListener)
    }
  }

  /**
   * Internal fetch wrapper with timeout and error handling
   */
  private async fetch(path: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController()
    const signal = controller.signal
    let timeoutId: NodeJS.Timeout | undefined

    try {
      // Set timeout and store ID for cleanup
      timeoutId = setTimeout(() => {
        controller.abort()
        timeoutId = undefined
      }, this.timeout)

      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal,
      })

      // Clear timeout immediately on successful response
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }

      if (!response.ok) {
        const error = await response.json().catch((e) => {
          if (this.debug) {
            console.warn('Failed to parse error response:', e)
          }
          return { message: response.statusText }
        })
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (err) {
      // Ensure timeout is cleared on error
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
      throw err
    }
  }
}

/**
 * Create an error tracking client
 */
export function createClient(config?: ErrorClientConfig): ErrorClient {
  return new ErrorClient(config)
}
