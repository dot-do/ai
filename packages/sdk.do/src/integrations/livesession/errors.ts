/**
 * Livesession Errors
 *
 * Auto-generated error handling for Livesession Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/livesession
 */

/**
 * Error type enum
 */
export enum LivesessionErrorType {
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
 * Livesession Error class
 *
 * Custom error class for Livesession Integration operations.
 */
export class LivesessionError extends Error {
  public readonly code: string | number
  public readonly type: LivesessionErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LivesessionErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LivesessionError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LivesessionError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LivesessionError instance
   */
  static fromError(error: any): LivesessionError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LivesessionErrorType; retryable: boolean }> = {
      '401': { type: LivesessionErrorType.Authentication, retryable: false },
      '429': { type: LivesessionErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LivesessionError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LivesessionErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LivesessionErrorType.Authentication
    } else if (statusCode === 403) {
      type = LivesessionErrorType.Authorization
    } else if (statusCode === 404) {
      type = LivesessionErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LivesessionErrorType.Validation
    } else if (statusCode === 429) {
      type = LivesessionErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LivesessionErrorType.Server
      retryable = true
    }

    return new LivesessionError(message, code, type, {
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
    return this.type === LivesessionErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LivesessionErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LivesessionErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LivesessionErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LivesessionErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LivesessionErrorType.Server
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
