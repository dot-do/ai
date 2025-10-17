/**
 * Yelp Errors
 *
 * Auto-generated error handling for Yelp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/yelp
 */

/**
 * Error type enum
 */
export enum YelpErrorType {
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
 * Yelp Error class
 *
 * Custom error class for Yelp Integration operations.
 */
export class YelpError extends Error {
  public readonly code: string | number
  public readonly type: YelpErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: YelpErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'YelpError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YelpError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns YelpError instance
   */
  static fromError(error: any): YelpError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: YelpErrorType; retryable: boolean }> = {
      '401': { type: YelpErrorType.Authentication, retryable: false },
      '429': { type: YelpErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new YelpError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = YelpErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = YelpErrorType.Authentication
    } else if (statusCode === 403) {
      type = YelpErrorType.Authorization
    } else if (statusCode === 404) {
      type = YelpErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = YelpErrorType.Validation
    } else if (statusCode === 429) {
      type = YelpErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = YelpErrorType.Server
      retryable = true
    }

    return new YelpError(message, code, type, {
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
    return this.type === YelpErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === YelpErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === YelpErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === YelpErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === YelpErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === YelpErrorType.Server
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
