/**
 * Updown io Errors
 *
 * Auto-generated error handling for Updown io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/updown_io
 */

/**
 * Error type enum
 */
export enum UpdownIoErrorType {
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
 * Updown io Error class
 *
 * Custom error class for Updown io Integration operations.
 */
export class UpdownIoError extends Error {
  public readonly code: string | number
  public readonly type: UpdownIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: UpdownIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'UpdownIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UpdownIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns UpdownIoError instance
   */
  static fromError(error: any): UpdownIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: UpdownIoErrorType; retryable: boolean }> = {
      '401': { type: UpdownIoErrorType.Authentication, retryable: false },
      '429': { type: UpdownIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new UpdownIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = UpdownIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = UpdownIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = UpdownIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = UpdownIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = UpdownIoErrorType.Validation
    } else if (statusCode === 429) {
      type = UpdownIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = UpdownIoErrorType.Server
      retryable = true
    }

    return new UpdownIoError(message, code, type, {
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
    return this.type === UpdownIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === UpdownIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === UpdownIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === UpdownIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === UpdownIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === UpdownIoErrorType.Server
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
