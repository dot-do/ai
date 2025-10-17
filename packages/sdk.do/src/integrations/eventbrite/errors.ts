/**
 * Eventbrite Errors
 *
 * Auto-generated error handling for Eventbrite Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/eventbrite
 */

/**
 * Error type enum
 */
export enum EventbriteErrorType {
  Authentication = 'authentication',
  Authorization = 'authorization',
  Validation = 'validation',
  NotFound = 'not_found',
  RateLimit = 'rate_limit',
  Server = 'server',
  Network = 'network',
  Unknown = 'unknown',
}

/**
 * Eventbrite Error class
 *
 * Custom error class for Eventbrite Integration operations.
 */
export class EventbriteError extends Error {
  public readonly code: string | number
  public readonly type: EventbriteErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EventbriteErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EventbriteError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EventbriteError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EventbriteError instance
   */
  static fromError(error: any): EventbriteError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EventbriteErrorType; retryable: boolean }> = {
      '401': { type: EventbriteErrorType.Authentication, retryable: false },
      '429': { type: EventbriteErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EventbriteError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EventbriteErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EventbriteErrorType.Authentication
    } else if (statusCode === 403) {
      type = EventbriteErrorType.Authorization
    } else if (statusCode === 404) {
      type = EventbriteErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EventbriteErrorType.Validation
    } else if (statusCode === 429) {
      type = EventbriteErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EventbriteErrorType.Server
      retryable = true
    }

    return new EventbriteError(message, code, type, {
      statusCode,
      retryable,
      originalError: error,
    })
  }

  /** Check if error is retryable */
  isRetriable(): boolean {
    return this.retryable
  }

  /** Check if error is authentication error */
  isAuthenticationError(): boolean {
    return this.type === EventbriteErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EventbriteErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EventbriteErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EventbriteErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EventbriteErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EventbriteErrorType.Server
  }

  /** Get error details as object */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      type: this.type,
      statusCode: this.statusCode,
      retryable: this.retryable,
    }
  }
}
