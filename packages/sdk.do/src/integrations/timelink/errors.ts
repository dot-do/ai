/**
 * Timelink Errors
 *
 * Auto-generated error handling for Timelink Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/timelink
 */

/**
 * Error type enum
 */
export enum TimelinkErrorType {
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
 * Timelink Error class
 *
 * Custom error class for Timelink Integration operations.
 */
export class TimelinkError extends Error {
  public readonly code: string | number
  public readonly type: TimelinkErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TimelinkErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TimelinkError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimelinkError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TimelinkError instance
   */
  static fromError(error: any): TimelinkError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TimelinkErrorType; retryable: boolean }> = {
      '401': { type: TimelinkErrorType.Authentication, retryable: false },
      '429': { type: TimelinkErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TimelinkError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TimelinkErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TimelinkErrorType.Authentication
    } else if (statusCode === 403) {
      type = TimelinkErrorType.Authorization
    } else if (statusCode === 404) {
      type = TimelinkErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TimelinkErrorType.Validation
    } else if (statusCode === 429) {
      type = TimelinkErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TimelinkErrorType.Server
      retryable = true
    }

    return new TimelinkError(message, code, type, {
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
    return this.type === TimelinkErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TimelinkErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TimelinkErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TimelinkErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TimelinkErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TimelinkErrorType.Server
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
