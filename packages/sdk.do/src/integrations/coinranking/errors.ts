/**
 * Coinranking Errors
 *
 * Auto-generated error handling for Coinranking Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/coinranking
 */

/**
 * Error type enum
 */
export enum CoinrankingErrorType {
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
 * Coinranking Error class
 *
 * Custom error class for Coinranking Integration operations.
 */
export class CoinrankingError extends Error {
  public readonly code: string | number
  public readonly type: CoinrankingErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CoinrankingErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CoinrankingError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CoinrankingError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CoinrankingError instance
   */
  static fromError(error: any): CoinrankingError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CoinrankingErrorType; retryable: boolean }> = {
      '401': { type: CoinrankingErrorType.Authentication, retryable: false },
      '429': { type: CoinrankingErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CoinrankingError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CoinrankingErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CoinrankingErrorType.Authentication
    } else if (statusCode === 403) {
      type = CoinrankingErrorType.Authorization
    } else if (statusCode === 404) {
      type = CoinrankingErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CoinrankingErrorType.Validation
    } else if (statusCode === 429) {
      type = CoinrankingErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CoinrankingErrorType.Server
      retryable = true
    }

    return new CoinrankingError(message, code, type, {
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
    return this.type === CoinrankingErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CoinrankingErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CoinrankingErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CoinrankingErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CoinrankingErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CoinrankingErrorType.Server
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
