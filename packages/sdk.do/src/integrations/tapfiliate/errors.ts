/**
 * Tapfiliate Errors
 *
 * Auto-generated error handling for Tapfiliate Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tapfiliate
 */

/**
 * Error type enum
 */
export enum TapfiliateErrorType {
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
 * Tapfiliate Error class
 *
 * Custom error class for Tapfiliate Integration operations.
 */
export class TapfiliateError extends Error {
  public readonly code: string | number
  public readonly type: TapfiliateErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TapfiliateErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TapfiliateError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TapfiliateError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TapfiliateError instance
   */
  static fromError(error: any): TapfiliateError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TapfiliateErrorType; retryable: boolean }> = {
      '401': { type: TapfiliateErrorType.Authentication, retryable: false },
      '429': { type: TapfiliateErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TapfiliateError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TapfiliateErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TapfiliateErrorType.Authentication
    } else if (statusCode === 403) {
      type = TapfiliateErrorType.Authorization
    } else if (statusCode === 404) {
      type = TapfiliateErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TapfiliateErrorType.Validation
    } else if (statusCode === 429) {
      type = TapfiliateErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TapfiliateErrorType.Server
      retryable = true
    }

    return new TapfiliateError(message, code, type, {
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
    return this.type === TapfiliateErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TapfiliateErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TapfiliateErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TapfiliateErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TapfiliateErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TapfiliateErrorType.Server
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
