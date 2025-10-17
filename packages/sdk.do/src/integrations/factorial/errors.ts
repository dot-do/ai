/**
 * Factorial Errors
 *
 * Auto-generated error handling for Factorial Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/factorial
 */

/**
 * Error type enum
 */
export enum FactorialErrorType {
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
 * Factorial Error class
 *
 * Custom error class for Factorial Integration operations.
 */
export class FactorialError extends Error {
  public readonly code: string | number
  public readonly type: FactorialErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FactorialErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FactorialError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FactorialError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FactorialError instance
   */
  static fromError(error: any): FactorialError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FactorialErrorType; retryable: boolean }> = {
      '401': { type: FactorialErrorType.Authentication, retryable: false },
      '429': { type: FactorialErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FactorialError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FactorialErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FactorialErrorType.Authentication
    } else if (statusCode === 403) {
      type = FactorialErrorType.Authorization
    } else if (statusCode === 404) {
      type = FactorialErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FactorialErrorType.Validation
    } else if (statusCode === 429) {
      type = FactorialErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FactorialErrorType.Server
      retryable = true
    }

    return new FactorialError(message, code, type, {
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
    return this.type === FactorialErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FactorialErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FactorialErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FactorialErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FactorialErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FactorialErrorType.Server
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
