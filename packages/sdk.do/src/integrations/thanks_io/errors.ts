/**
 * Thanks io Errors
 *
 * Auto-generated error handling for Thanks io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/thanks_io
 */

/**
 * Error type enum
 */
export enum ThanksIoErrorType {
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
 * Thanks io Error class
 *
 * Custom error class for Thanks io Integration operations.
 */
export class ThanksIoError extends Error {
  public readonly code: string | number
  public readonly type: ThanksIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ThanksIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ThanksIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ThanksIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ThanksIoError instance
   */
  static fromError(error: any): ThanksIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ThanksIoErrorType; retryable: boolean }> = {
      '401': { type: ThanksIoErrorType.Authentication, retryable: false },
      '429': { type: ThanksIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ThanksIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ThanksIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ThanksIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = ThanksIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = ThanksIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ThanksIoErrorType.Validation
    } else if (statusCode === 429) {
      type = ThanksIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ThanksIoErrorType.Server
      retryable = true
    }

    return new ThanksIoError(message, code, type, {
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
    return this.type === ThanksIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ThanksIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ThanksIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ThanksIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ThanksIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ThanksIoErrorType.Server
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
