/**
 * Postmark Errors
 *
 * Auto-generated error handling for Postmark Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/postmark
 */

/**
 * Error type enum
 */
export enum PostmarkErrorType {
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
 * Postmark Error class
 *
 * Custom error class for Postmark Integration operations.
 */
export class PostmarkError extends Error {
  public readonly code: string | number
  public readonly type: PostmarkErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PostmarkErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PostmarkError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PostmarkError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PostmarkError instance
   */
  static fromError(error: any): PostmarkError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PostmarkErrorType; retryable: boolean }> = {
      '401': { type: PostmarkErrorType.Authentication, retryable: false },
      '429': { type: PostmarkErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PostmarkError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PostmarkErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PostmarkErrorType.Authentication
    } else if (statusCode === 403) {
      type = PostmarkErrorType.Authorization
    } else if (statusCode === 404) {
      type = PostmarkErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PostmarkErrorType.Validation
    } else if (statusCode === 429) {
      type = PostmarkErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PostmarkErrorType.Server
      retryable = true
    }

    return new PostmarkError(message, code, type, {
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
    return this.type === PostmarkErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PostmarkErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PostmarkErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PostmarkErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PostmarkErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PostmarkErrorType.Server
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
