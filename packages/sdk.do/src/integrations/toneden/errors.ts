/**
 * Toneden Errors
 *
 * Auto-generated error handling for Toneden Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/toneden
 */

/**
 * Error type enum
 */
export enum TonedenErrorType {
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
 * Toneden Error class
 *
 * Custom error class for Toneden Integration operations.
 */
export class TonedenError extends Error {
  public readonly code: string | number
  public readonly type: TonedenErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TonedenErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TonedenError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TonedenError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TonedenError instance
   */
  static fromError(error: any): TonedenError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TonedenErrorType; retryable: boolean }> = {
      '401': { type: TonedenErrorType.Authentication, retryable: false },
      '429': { type: TonedenErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TonedenError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TonedenErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TonedenErrorType.Authentication
    } else if (statusCode === 403) {
      type = TonedenErrorType.Authorization
    } else if (statusCode === 404) {
      type = TonedenErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TonedenErrorType.Validation
    } else if (statusCode === 429) {
      type = TonedenErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TonedenErrorType.Server
      retryable = true
    }

    return new TonedenError(message, code, type, {
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
    return this.type === TonedenErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TonedenErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TonedenErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TonedenErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TonedenErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TonedenErrorType.Server
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
