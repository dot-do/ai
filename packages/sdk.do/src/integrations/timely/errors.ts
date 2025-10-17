/**
 * Timely Errors
 *
 * Auto-generated error handling for Timely Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/timely
 */

/**
 * Error type enum
 */
export enum TimelyErrorType {
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
 * Timely Error class
 *
 * Custom error class for Timely Integration operations.
 */
export class TimelyError extends Error {
  public readonly code: string | number
  public readonly type: TimelyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TimelyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TimelyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimelyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TimelyError instance
   */
  static fromError(error: any): TimelyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TimelyErrorType; retryable: boolean }> = {
      '401': { type: TimelyErrorType.Authentication, retryable: false },
      '429': { type: TimelyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TimelyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TimelyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TimelyErrorType.Authentication
    } else if (statusCode === 403) {
      type = TimelyErrorType.Authorization
    } else if (statusCode === 404) {
      type = TimelyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TimelyErrorType.Validation
    } else if (statusCode === 429) {
      type = TimelyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TimelyErrorType.Server
      retryable = true
    }

    return new TimelyError(message, code, type, {
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
    return this.type === TimelyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TimelyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TimelyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TimelyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TimelyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TimelyErrorType.Server
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
