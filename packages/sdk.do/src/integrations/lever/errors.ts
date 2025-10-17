/**
 * Lever Errors
 *
 * Auto-generated error handling for Lever Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lever
 */

/**
 * Error type enum
 */
export enum LeverErrorType {
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
 * Lever Error class
 *
 * Custom error class for Lever Integration operations.
 */
export class LeverError extends Error {
  public readonly code: string | number
  public readonly type: LeverErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LeverErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LeverError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LeverError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LeverError instance
   */
  static fromError(error: any): LeverError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LeverErrorType; retryable: boolean }> = {
      '401': { type: LeverErrorType.Authentication, retryable: false },
      '429': { type: LeverErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LeverError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LeverErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LeverErrorType.Authentication
    } else if (statusCode === 403) {
      type = LeverErrorType.Authorization
    } else if (statusCode === 404) {
      type = LeverErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LeverErrorType.Validation
    } else if (statusCode === 429) {
      type = LeverErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LeverErrorType.Server
      retryable = true
    }

    return new LeverError(message, code, type, {
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
    return this.type === LeverErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LeverErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LeverErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LeverErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LeverErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LeverErrorType.Server
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
