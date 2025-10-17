/**
 * Alpha vantage Errors
 *
 * Auto-generated error handling for Alpha vantage Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/alpha_vantage
 */

/**
 * Error type enum
 */
export enum AlphaVantageErrorType {
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
 * Alpha vantage Error class
 *
 * Custom error class for Alpha vantage Integration operations.
 */
export class AlphaVantageError extends Error {
  public readonly code: string | number
  public readonly type: AlphaVantageErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AlphaVantageErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AlphaVantageError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlphaVantageError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AlphaVantageError instance
   */
  static fromError(error: any): AlphaVantageError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AlphaVantageErrorType; retryable: boolean }> = {
      '401': { type: AlphaVantageErrorType.Authentication, retryable: false },
      '429': { type: AlphaVantageErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AlphaVantageError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AlphaVantageErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AlphaVantageErrorType.Authentication
    } else if (statusCode === 403) {
      type = AlphaVantageErrorType.Authorization
    } else if (statusCode === 404) {
      type = AlphaVantageErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AlphaVantageErrorType.Validation
    } else if (statusCode === 429) {
      type = AlphaVantageErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AlphaVantageErrorType.Server
      retryable = true
    }

    return new AlphaVantageError(message, code, type, {
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
    return this.type === AlphaVantageErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AlphaVantageErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AlphaVantageErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AlphaVantageErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AlphaVantageErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AlphaVantageErrorType.Server
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
