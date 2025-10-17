/**
 * Teltel Errors
 *
 * Auto-generated error handling for Teltel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/teltel
 */

/**
 * Error type enum
 */
export enum TeltelErrorType {
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
 * Teltel Error class
 *
 * Custom error class for Teltel Integration operations.
 */
export class TeltelError extends Error {
  public readonly code: string | number
  public readonly type: TeltelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TeltelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TeltelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TeltelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TeltelError instance
   */
  static fromError(error: any): TeltelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TeltelErrorType; retryable: boolean }> = {
      '401': { type: TeltelErrorType.Authentication, retryable: false },
      '429': { type: TeltelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TeltelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TeltelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TeltelErrorType.Authentication
    } else if (statusCode === 403) {
      type = TeltelErrorType.Authorization
    } else if (statusCode === 404) {
      type = TeltelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TeltelErrorType.Validation
    } else if (statusCode === 429) {
      type = TeltelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TeltelErrorType.Server
      retryable = true
    }

    return new TeltelError(message, code, type, {
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
    return this.type === TeltelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TeltelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TeltelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TeltelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TeltelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TeltelErrorType.Server
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
