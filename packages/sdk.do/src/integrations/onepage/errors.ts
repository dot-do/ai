/**
 * Onepage Errors
 *
 * Auto-generated error handling for Onepage Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onepage
 */

/**
 * Error type enum
 */
export enum OnepageErrorType {
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
 * Onepage Error class
 *
 * Custom error class for Onepage Integration operations.
 */
export class OnepageError extends Error {
  public readonly code: string | number
  public readonly type: OnepageErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OnepageErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OnepageError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OnepageError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OnepageError instance
   */
  static fromError(error: any): OnepageError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OnepageErrorType; retryable: boolean }> = {
      '401': { type: OnepageErrorType.Authentication, retryable: false },
      '429': { type: OnepageErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OnepageError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OnepageErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OnepageErrorType.Authentication
    } else if (statusCode === 403) {
      type = OnepageErrorType.Authorization
    } else if (statusCode === 404) {
      type = OnepageErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OnepageErrorType.Validation
    } else if (statusCode === 429) {
      type = OnepageErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OnepageErrorType.Server
      retryable = true
    }

    return new OnepageError(message, code, type, {
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
    return this.type === OnepageErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OnepageErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OnepageErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OnepageErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OnepageErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OnepageErrorType.Server
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
