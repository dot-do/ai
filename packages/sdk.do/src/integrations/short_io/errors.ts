/**
 * Short io Errors
 *
 * Auto-generated error handling for Short io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/short_io
 */

/**
 * Error type enum
 */
export enum ShortIoErrorType {
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
 * Short io Error class
 *
 * Custom error class for Short io Integration operations.
 */
export class ShortIoError extends Error {
  public readonly code: string | number
  public readonly type: ShortIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ShortIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ShortIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShortIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ShortIoError instance
   */
  static fromError(error: any): ShortIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ShortIoErrorType; retryable: boolean }> = {
      '401': { type: ShortIoErrorType.Authentication, retryable: false },
      '429': { type: ShortIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ShortIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ShortIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ShortIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = ShortIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = ShortIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ShortIoErrorType.Validation
    } else if (statusCode === 429) {
      type = ShortIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ShortIoErrorType.Server
      retryable = true
    }

    return new ShortIoError(message, code, type, {
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
    return this.type === ShortIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ShortIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ShortIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ShortIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ShortIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ShortIoErrorType.Server
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
