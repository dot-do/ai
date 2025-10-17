/**
 * Bookingmood Errors
 *
 * Auto-generated error handling for Bookingmood Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bookingmood
 */

/**
 * Error type enum
 */
export enum BookingmoodErrorType {
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
 * Bookingmood Error class
 *
 * Custom error class for Bookingmood Integration operations.
 */
export class BookingmoodError extends Error {
  public readonly code: string | number
  public readonly type: BookingmoodErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BookingmoodErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BookingmoodError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BookingmoodError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BookingmoodError instance
   */
  static fromError(error: any): BookingmoodError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BookingmoodErrorType; retryable: boolean }> = {
      '401': { type: BookingmoodErrorType.Authentication, retryable: false },
      '429': { type: BookingmoodErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BookingmoodError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BookingmoodErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BookingmoodErrorType.Authentication
    } else if (statusCode === 403) {
      type = BookingmoodErrorType.Authorization
    } else if (statusCode === 404) {
      type = BookingmoodErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BookingmoodErrorType.Validation
    } else if (statusCode === 429) {
      type = BookingmoodErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BookingmoodErrorType.Server
      retryable = true
    }

    return new BookingmoodError(message, code, type, {
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
    return this.type === BookingmoodErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BookingmoodErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BookingmoodErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BookingmoodErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BookingmoodErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BookingmoodErrorType.Server
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
