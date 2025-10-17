/**
 * Reddit Errors
 *
 * Auto-generated error handling for Reddit Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/reddit
 */

/**
 * Error type enum
 */
export enum RedditErrorType {
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
 * Reddit Error class
 *
 * Custom error class for Reddit Integration operations.
 */
export class RedditError extends Error {
  public readonly code: string | number
  public readonly type: RedditErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RedditErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RedditError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RedditError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RedditError instance
   */
  static fromError(error: any): RedditError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RedditErrorType; retryable: boolean }> = {
      '401': { type: RedditErrorType.Authentication, retryable: false },
      '429': { type: RedditErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RedditError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RedditErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RedditErrorType.Authentication
    } else if (statusCode === 403) {
      type = RedditErrorType.Authorization
    } else if (statusCode === 404) {
      type = RedditErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RedditErrorType.Validation
    } else if (statusCode === 429) {
      type = RedditErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RedditErrorType.Server
      retryable = true
    }

    return new RedditError(message, code, type, {
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
    return this.type === RedditErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RedditErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RedditErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RedditErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RedditErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RedditErrorType.Server
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
