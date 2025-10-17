/**
 * The odds api Errors
 *
 * Auto-generated error handling for The odds api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/the_odds_api
 */

/**
 * Error type enum
 */
export enum TheOddsApiErrorType {
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
 * The odds api Error class
 *
 * Custom error class for The odds api Integration operations.
 */
export class TheOddsApiError extends Error {
  public readonly code: string | number
  public readonly type: TheOddsApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TheOddsApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TheOddsApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TheOddsApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TheOddsApiError instance
   */
  static fromError(error: any): TheOddsApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TheOddsApiErrorType; retryable: boolean }> = {
      '401': { type: TheOddsApiErrorType.Authentication, retryable: false },
      '429': { type: TheOddsApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TheOddsApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TheOddsApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TheOddsApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = TheOddsApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = TheOddsApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TheOddsApiErrorType.Validation
    } else if (statusCode === 429) {
      type = TheOddsApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TheOddsApiErrorType.Server
      retryable = true
    }

    return new TheOddsApiError(message, code, type, {
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
    return this.type === TheOddsApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TheOddsApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TheOddsApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TheOddsApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TheOddsApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TheOddsApiErrorType.Server
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
