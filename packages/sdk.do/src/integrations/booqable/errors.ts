/**
 * Booqable Errors
 *
 * Auto-generated error handling for Booqable Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/booqable
 */

/**
 * Error type enum
 */
export enum BooqableErrorType {
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
 * Booqable Error class
 *
 * Custom error class for Booqable Integration operations.
 */
export class BooqableError extends Error {
  public readonly code: string | number
  public readonly type: BooqableErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BooqableErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BooqableError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BooqableError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BooqableError instance
   */
  static fromError(error: any): BooqableError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BooqableErrorType; retryable: boolean }> = {
      '401': { type: BooqableErrorType.Authentication, retryable: false },
      '429': { type: BooqableErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BooqableError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BooqableErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BooqableErrorType.Authentication
    } else if (statusCode === 403) {
      type = BooqableErrorType.Authorization
    } else if (statusCode === 404) {
      type = BooqableErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BooqableErrorType.Validation
    } else if (statusCode === 429) {
      type = BooqableErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BooqableErrorType.Server
      retryable = true
    }

    return new BooqableError(message, code, type, {
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
    return this.type === BooqableErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BooqableErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BooqableErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BooqableErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BooqableErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BooqableErrorType.Server
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
