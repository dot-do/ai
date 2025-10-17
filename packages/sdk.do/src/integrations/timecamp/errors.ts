/**
 * Timecamp Errors
 *
 * Auto-generated error handling for Timecamp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/timecamp
 */

/**
 * Error type enum
 */
export enum TimecampErrorType {
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
 * Timecamp Error class
 *
 * Custom error class for Timecamp Integration operations.
 */
export class TimecampError extends Error {
  public readonly code: string | number
  public readonly type: TimecampErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TimecampErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TimecampError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimecampError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TimecampError instance
   */
  static fromError(error: any): TimecampError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TimecampErrorType; retryable: boolean }> = {
      '401': { type: TimecampErrorType.Authentication, retryable: false },
      '429': { type: TimecampErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TimecampError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TimecampErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TimecampErrorType.Authentication
    } else if (statusCode === 403) {
      type = TimecampErrorType.Authorization
    } else if (statusCode === 404) {
      type = TimecampErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TimecampErrorType.Validation
    } else if (statusCode === 429) {
      type = TimecampErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TimecampErrorType.Server
      retryable = true
    }

    return new TimecampError(message, code, type, {
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
    return this.type === TimecampErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TimecampErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TimecampErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TimecampErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TimecampErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TimecampErrorType.Server
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
