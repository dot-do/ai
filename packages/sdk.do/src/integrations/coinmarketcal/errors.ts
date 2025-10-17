/**
 * Coinmarketcal Errors
 *
 * Auto-generated error handling for Coinmarketcal Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/coinmarketcal
 */

/**
 * Error type enum
 */
export enum CoinmarketcalErrorType {
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
 * Coinmarketcal Error class
 *
 * Custom error class for Coinmarketcal Integration operations.
 */
export class CoinmarketcalError extends Error {
  public readonly code: string | number
  public readonly type: CoinmarketcalErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CoinmarketcalErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CoinmarketcalError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CoinmarketcalError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CoinmarketcalError instance
   */
  static fromError(error: any): CoinmarketcalError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CoinmarketcalErrorType; retryable: boolean }> = {
      '401': { type: CoinmarketcalErrorType.Authentication, retryable: false },
      '429': { type: CoinmarketcalErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CoinmarketcalError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CoinmarketcalErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CoinmarketcalErrorType.Authentication
    } else if (statusCode === 403) {
      type = CoinmarketcalErrorType.Authorization
    } else if (statusCode === 404) {
      type = CoinmarketcalErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CoinmarketcalErrorType.Validation
    } else if (statusCode === 429) {
      type = CoinmarketcalErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CoinmarketcalErrorType.Server
      retryable = true
    }

    return new CoinmarketcalError(message, code, type, {
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
    return this.type === CoinmarketcalErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CoinmarketcalErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CoinmarketcalErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CoinmarketcalErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CoinmarketcalErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CoinmarketcalErrorType.Server
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
