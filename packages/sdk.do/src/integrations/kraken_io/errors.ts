/**
 * Kraken io Errors
 *
 * Auto-generated error handling for Kraken io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kraken_io
 */

/**
 * Error type enum
 */
export enum KrakenIoErrorType {
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
 * Kraken io Error class
 *
 * Custom error class for Kraken io Integration operations.
 */
export class KrakenIoError extends Error {
  public readonly code: string | number
  public readonly type: KrakenIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KrakenIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KrakenIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KrakenIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KrakenIoError instance
   */
  static fromError(error: any): KrakenIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KrakenIoErrorType; retryable: boolean }> = {
      '401': { type: KrakenIoErrorType.Authentication, retryable: false },
      '429': { type: KrakenIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KrakenIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KrakenIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KrakenIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = KrakenIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = KrakenIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KrakenIoErrorType.Validation
    } else if (statusCode === 429) {
      type = KrakenIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KrakenIoErrorType.Server
      retryable = true
    }

    return new KrakenIoError(message, code, type, {
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
    return this.type === KrakenIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KrakenIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KrakenIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KrakenIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KrakenIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KrakenIoErrorType.Server
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
