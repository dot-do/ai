/**
 * Timelinesai Errors
 *
 * Auto-generated error handling for Timelinesai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/timelinesai
 */

/**
 * Error type enum
 */
export enum TimelinesaiErrorType {
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
 * Timelinesai Error class
 *
 * Custom error class for Timelinesai Integration operations.
 */
export class TimelinesaiError extends Error {
  public readonly code: string | number
  public readonly type: TimelinesaiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TimelinesaiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TimelinesaiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimelinesaiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TimelinesaiError instance
   */
  static fromError(error: any): TimelinesaiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TimelinesaiErrorType; retryable: boolean }> = {
      '401': { type: TimelinesaiErrorType.Authentication, retryable: false },
      '429': { type: TimelinesaiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TimelinesaiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TimelinesaiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TimelinesaiErrorType.Authentication
    } else if (statusCode === 403) {
      type = TimelinesaiErrorType.Authorization
    } else if (statusCode === 404) {
      type = TimelinesaiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TimelinesaiErrorType.Validation
    } else if (statusCode === 429) {
      type = TimelinesaiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TimelinesaiErrorType.Server
      retryable = true
    }

    return new TimelinesaiError(message, code, type, {
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
    return this.type === TimelinesaiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TimelinesaiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TimelinesaiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TimelinesaiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TimelinesaiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TimelinesaiErrorType.Server
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
