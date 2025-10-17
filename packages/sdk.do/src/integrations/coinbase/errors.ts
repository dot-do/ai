/**
 * Coinbase Errors
 *
 * Auto-generated error handling for Coinbase Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/coinbase
 */

/**
 * Error type enum
 */
export enum CoinbaseErrorType {
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
 * Coinbase Error class
 *
 * Custom error class for Coinbase Integration operations.
 */
export class CoinbaseError extends Error {
  public readonly code: string | number
  public readonly type: CoinbaseErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CoinbaseErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CoinbaseError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CoinbaseError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CoinbaseError instance
   */
  static fromError(error: any): CoinbaseError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CoinbaseErrorType; retryable: boolean }> = {
      '401': { type: CoinbaseErrorType.Authentication, retryable: false },
      '429': { type: CoinbaseErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CoinbaseError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CoinbaseErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CoinbaseErrorType.Authentication
    } else if (statusCode === 403) {
      type = CoinbaseErrorType.Authorization
    } else if (statusCode === 404) {
      type = CoinbaseErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CoinbaseErrorType.Validation
    } else if (statusCode === 429) {
      type = CoinbaseErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CoinbaseErrorType.Server
      retryable = true
    }

    return new CoinbaseError(message, code, type, {
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
    return this.type === CoinbaseErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CoinbaseErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CoinbaseErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CoinbaseErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CoinbaseErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CoinbaseErrorType.Server
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
