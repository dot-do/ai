/**
 * Twelve data Errors
 *
 * Auto-generated error handling for Twelve data Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twelve_data
 */

/**
 * Error type enum
 */
export enum TwelveDataErrorType {
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
 * Twelve data Error class
 *
 * Custom error class for Twelve data Integration operations.
 */
export class TwelveDataError extends Error {
  public readonly code: string | number
  public readonly type: TwelveDataErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TwelveDataErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TwelveDataError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TwelveDataError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TwelveDataError instance
   */
  static fromError(error: any): TwelveDataError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TwelveDataErrorType; retryable: boolean }> = {
      '401': { type: TwelveDataErrorType.Authentication, retryable: false },
      '429': { type: TwelveDataErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TwelveDataError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TwelveDataErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TwelveDataErrorType.Authentication
    } else if (statusCode === 403) {
      type = TwelveDataErrorType.Authorization
    } else if (statusCode === 404) {
      type = TwelveDataErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TwelveDataErrorType.Validation
    } else if (statusCode === 429) {
      type = TwelveDataErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TwelveDataErrorType.Server
      retryable = true
    }

    return new TwelveDataError(message, code, type, {
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
    return this.type === TwelveDataErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TwelveDataErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TwelveDataErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TwelveDataErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TwelveDataErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TwelveDataErrorType.Server
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
