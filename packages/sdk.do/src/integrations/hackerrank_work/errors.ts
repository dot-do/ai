/**
 * Hackerrank work Errors
 *
 * Auto-generated error handling for Hackerrank work Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hackerrank_work
 */

/**
 * Error type enum
 */
export enum HackerrankWorkErrorType {
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
 * Hackerrank work Error class
 *
 * Custom error class for Hackerrank work Integration operations.
 */
export class HackerrankWorkError extends Error {
  public readonly code: string | number
  public readonly type: HackerrankWorkErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HackerrankWorkErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HackerrankWorkError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HackerrankWorkError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HackerrankWorkError instance
   */
  static fromError(error: any): HackerrankWorkError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HackerrankWorkErrorType; retryable: boolean }> = {
      '401': { type: HackerrankWorkErrorType.Authentication, retryable: false },
      '429': { type: HackerrankWorkErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HackerrankWorkError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HackerrankWorkErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HackerrankWorkErrorType.Authentication
    } else if (statusCode === 403) {
      type = HackerrankWorkErrorType.Authorization
    } else if (statusCode === 404) {
      type = HackerrankWorkErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HackerrankWorkErrorType.Validation
    } else if (statusCode === 429) {
      type = HackerrankWorkErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HackerrankWorkErrorType.Server
      retryable = true
    }

    return new HackerrankWorkError(message, code, type, {
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
    return this.type === HackerrankWorkErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HackerrankWorkErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HackerrankWorkErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HackerrankWorkErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HackerrankWorkErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HackerrankWorkErrorType.Server
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
