/**
 * Seat geek Errors
 *
 * Auto-generated error handling for Seat geek Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/seat_geek
 */

/**
 * Error type enum
 */
export enum SeatGeekErrorType {
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
 * Seat geek Error class
 *
 * Custom error class for Seat geek Integration operations.
 */
export class SeatGeekError extends Error {
  public readonly code: string | number
  public readonly type: SeatGeekErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SeatGeekErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SeatGeekError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SeatGeekError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SeatGeekError instance
   */
  static fromError(error: any): SeatGeekError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SeatGeekErrorType; retryable: boolean }> = {
      '401': { type: SeatGeekErrorType.Authentication, retryable: false },
      '429': { type: SeatGeekErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SeatGeekError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SeatGeekErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SeatGeekErrorType.Authentication
    } else if (statusCode === 403) {
      type = SeatGeekErrorType.Authorization
    } else if (statusCode === 404) {
      type = SeatGeekErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SeatGeekErrorType.Validation
    } else if (statusCode === 429) {
      type = SeatGeekErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SeatGeekErrorType.Server
      retryable = true
    }

    return new SeatGeekError(message, code, type, {
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
    return this.type === SeatGeekErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SeatGeekErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SeatGeekErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SeatGeekErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SeatGeekErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SeatGeekErrorType.Server
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
