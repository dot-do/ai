/**
 * Postgrid Errors
 *
 * Auto-generated error handling for Postgrid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/postgrid
 */

/**
 * Error type enum
 */
export enum PostgridErrorType {
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
 * Postgrid Error class
 *
 * Custom error class for Postgrid Integration operations.
 */
export class PostgridError extends Error {
  public readonly code: string | number
  public readonly type: PostgridErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PostgridErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PostgridError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PostgridError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PostgridError instance
   */
  static fromError(error: any): PostgridError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PostgridErrorType; retryable: boolean }> = {
      '401': { type: PostgridErrorType.Authentication, retryable: false },
      '429': { type: PostgridErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PostgridError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PostgridErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PostgridErrorType.Authentication
    } else if (statusCode === 403) {
      type = PostgridErrorType.Authorization
    } else if (statusCode === 404) {
      type = PostgridErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PostgridErrorType.Validation
    } else if (statusCode === 429) {
      type = PostgridErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PostgridErrorType.Server
      retryable = true
    }

    return new PostgridError(message, code, type, {
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
    return this.type === PostgridErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PostgridErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PostgridErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PostgridErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PostgridErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PostgridErrorType.Server
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
