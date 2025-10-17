/**
 * Eventee Errors
 *
 * Auto-generated error handling for Eventee Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/eventee
 */

/**
 * Error type enum
 */
export enum EventeeErrorType {
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
 * Eventee Error class
 *
 * Custom error class for Eventee Integration operations.
 */
export class EventeeError extends Error {
  public readonly code: string | number
  public readonly type: EventeeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EventeeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EventeeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EventeeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EventeeError instance
   */
  static fromError(error: any): EventeeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EventeeErrorType; retryable: boolean }> = {
      '401': { type: EventeeErrorType.Authentication, retryable: false },
      '429': { type: EventeeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EventeeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EventeeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EventeeErrorType.Authentication
    } else if (statusCode === 403) {
      type = EventeeErrorType.Authorization
    } else if (statusCode === 404) {
      type = EventeeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EventeeErrorType.Validation
    } else if (statusCode === 429) {
      type = EventeeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EventeeErrorType.Server
      retryable = true
    }

    return new EventeeError(message, code, type, {
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
    return this.type === EventeeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EventeeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EventeeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EventeeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EventeeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EventeeErrorType.Server
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
