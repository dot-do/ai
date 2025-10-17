/**
 * Streamtime Errors
 *
 * Auto-generated error handling for Streamtime Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/streamtime
 */

/**
 * Error type enum
 */
export enum StreamtimeErrorType {
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
 * Streamtime Error class
 *
 * Custom error class for Streamtime Integration operations.
 */
export class StreamtimeError extends Error {
  public readonly code: string | number
  public readonly type: StreamtimeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: StreamtimeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'StreamtimeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StreamtimeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns StreamtimeError instance
   */
  static fromError(error: any): StreamtimeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: StreamtimeErrorType; retryable: boolean }> = {
      '401': { type: StreamtimeErrorType.Authentication, retryable: false },
      '429': { type: StreamtimeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new StreamtimeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = StreamtimeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = StreamtimeErrorType.Authentication
    } else if (statusCode === 403) {
      type = StreamtimeErrorType.Authorization
    } else if (statusCode === 404) {
      type = StreamtimeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = StreamtimeErrorType.Validation
    } else if (statusCode === 429) {
      type = StreamtimeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = StreamtimeErrorType.Server
      retryable = true
    }

    return new StreamtimeError(message, code, type, {
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
    return this.type === StreamtimeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === StreamtimeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === StreamtimeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === StreamtimeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === StreamtimeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === StreamtimeErrorType.Server
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
