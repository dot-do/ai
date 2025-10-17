/**
 * Postgrid verify Errors
 *
 * Auto-generated error handling for Postgrid verify Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/postgrid_verify
 */

/**
 * Error type enum
 */
export enum PostgridVerifyErrorType {
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
 * Postgrid verify Error class
 *
 * Custom error class for Postgrid verify Integration operations.
 */
export class PostgridVerifyError extends Error {
  public readonly code: string | number
  public readonly type: PostgridVerifyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PostgridVerifyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PostgridVerifyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PostgridVerifyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PostgridVerifyError instance
   */
  static fromError(error: any): PostgridVerifyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PostgridVerifyErrorType; retryable: boolean }> = {
      '401': { type: PostgridVerifyErrorType.Authentication, retryable: false },
      '429': { type: PostgridVerifyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PostgridVerifyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PostgridVerifyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PostgridVerifyErrorType.Authentication
    } else if (statusCode === 403) {
      type = PostgridVerifyErrorType.Authorization
    } else if (statusCode === 404) {
      type = PostgridVerifyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PostgridVerifyErrorType.Validation
    } else if (statusCode === 429) {
      type = PostgridVerifyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PostgridVerifyErrorType.Server
      retryable = true
    }

    return new PostgridVerifyError(message, code, type, {
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
    return this.type === PostgridVerifyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PostgridVerifyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PostgridVerifyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PostgridVerifyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PostgridVerifyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PostgridVerifyErrorType.Server
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
