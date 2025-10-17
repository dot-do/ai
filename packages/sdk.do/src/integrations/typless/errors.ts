/**
 * Typless Errors
 *
 * Auto-generated error handling for Typless Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/typless
 */

/**
 * Error type enum
 */
export enum TyplessErrorType {
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
 * Typless Error class
 *
 * Custom error class for Typless Integration operations.
 */
export class TyplessError extends Error {
  public readonly code: string | number
  public readonly type: TyplessErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TyplessErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TyplessError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TyplessError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TyplessError instance
   */
  static fromError(error: any): TyplessError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TyplessErrorType; retryable: boolean }> = {
      '401': { type: TyplessErrorType.Authentication, retryable: false },
      '429': { type: TyplessErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TyplessError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TyplessErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TyplessErrorType.Authentication
    } else if (statusCode === 403) {
      type = TyplessErrorType.Authorization
    } else if (statusCode === 404) {
      type = TyplessErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TyplessErrorType.Validation
    } else if (statusCode === 429) {
      type = TyplessErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TyplessErrorType.Server
      retryable = true
    }

    return new TyplessError(message, code, type, {
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
    return this.type === TyplessErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TyplessErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TyplessErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TyplessErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TyplessErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TyplessErrorType.Server
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
