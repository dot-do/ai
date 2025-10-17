/**
 * Twitter Errors
 *
 * Auto-generated error handling for Twitter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twitter
 */

/**
 * Error type enum
 */
export enum TwitterErrorType {
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
 * Twitter Error class
 *
 * Custom error class for Twitter Integration operations.
 */
export class TwitterError extends Error {
  public readonly code: string | number
  public readonly type: TwitterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TwitterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TwitterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TwitterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TwitterError instance
   */
  static fromError(error: any): TwitterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TwitterErrorType; retryable: boolean }> = {
      '401': { type: TwitterErrorType.Authentication, retryable: false },
      '429': { type: TwitterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TwitterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TwitterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TwitterErrorType.Authentication
    } else if (statusCode === 403) {
      type = TwitterErrorType.Authorization
    } else if (statusCode === 404) {
      type = TwitterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TwitterErrorType.Validation
    } else if (statusCode === 429) {
      type = TwitterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TwitterErrorType.Server
      retryable = true
    }

    return new TwitterError(message, code, type, {
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
    return this.type === TwitterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TwitterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TwitterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TwitterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TwitterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TwitterErrorType.Server
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
