/**
 * Timekit Errors
 *
 * Auto-generated error handling for Timekit Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/timekit
 */

/**
 * Error type enum
 */
export enum TimekitErrorType {
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
 * Timekit Error class
 *
 * Custom error class for Timekit Integration operations.
 */
export class TimekitError extends Error {
  public readonly code: string | number
  public readonly type: TimekitErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TimekitErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TimekitError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimekitError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TimekitError instance
   */
  static fromError(error: any): TimekitError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TimekitErrorType; retryable: boolean }> = {
      '401': { type: TimekitErrorType.Authentication, retryable: false },
      '429': { type: TimekitErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TimekitError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TimekitErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TimekitErrorType.Authentication
    } else if (statusCode === 403) {
      type = TimekitErrorType.Authorization
    } else if (statusCode === 404) {
      type = TimekitErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TimekitErrorType.Validation
    } else if (statusCode === 429) {
      type = TimekitErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TimekitErrorType.Server
      retryable = true
    }

    return new TimekitError(message, code, type, {
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
    return this.type === TimekitErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TimekitErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TimekitErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TimekitErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TimekitErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TimekitErrorType.Server
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
