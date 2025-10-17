/**
 * Fomo Errors
 *
 * Auto-generated error handling for Fomo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/fomo
 */

/**
 * Error type enum
 */
export enum FomoErrorType {
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
 * Fomo Error class
 *
 * Custom error class for Fomo Integration operations.
 */
export class FomoError extends Error {
  public readonly code: string | number
  public readonly type: FomoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FomoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FomoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FomoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FomoError instance
   */
  static fromError(error: any): FomoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FomoErrorType; retryable: boolean }> = {
      '401': { type: FomoErrorType.Authentication, retryable: false },
      '429': { type: FomoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FomoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FomoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FomoErrorType.Authentication
    } else if (statusCode === 403) {
      type = FomoErrorType.Authorization
    } else if (statusCode === 404) {
      type = FomoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FomoErrorType.Validation
    } else if (statusCode === 429) {
      type = FomoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FomoErrorType.Server
      retryable = true
    }

    return new FomoError(message, code, type, {
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
    return this.type === FomoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FomoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FomoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FomoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FomoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FomoErrorType.Server
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
