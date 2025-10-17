/**
 * Coinmarketcap Errors
 *
 * Auto-generated error handling for Coinmarketcap Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/coinmarketcap
 */

/**
 * Error type enum
 */
export enum CoinmarketcapErrorType {
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
 * Coinmarketcap Error class
 *
 * Custom error class for Coinmarketcap Integration operations.
 */
export class CoinmarketcapError extends Error {
  public readonly code: string | number
  public readonly type: CoinmarketcapErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CoinmarketcapErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CoinmarketcapError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CoinmarketcapError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CoinmarketcapError instance
   */
  static fromError(error: any): CoinmarketcapError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CoinmarketcapErrorType; retryable: boolean }> = {
      '401': { type: CoinmarketcapErrorType.Authentication, retryable: false },
      '429': { type: CoinmarketcapErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CoinmarketcapError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CoinmarketcapErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CoinmarketcapErrorType.Authentication
    } else if (statusCode === 403) {
      type = CoinmarketcapErrorType.Authorization
    } else if (statusCode === 404) {
      type = CoinmarketcapErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CoinmarketcapErrorType.Validation
    } else if (statusCode === 429) {
      type = CoinmarketcapErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CoinmarketcapErrorType.Server
      retryable = true
    }

    return new CoinmarketcapError(message, code, type, {
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
    return this.type === CoinmarketcapErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CoinmarketcapErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CoinmarketcapErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CoinmarketcapErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CoinmarketcapErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CoinmarketcapErrorType.Server
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
