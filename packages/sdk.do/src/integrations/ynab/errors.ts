/**
 * Ynab Errors
 *
 * Auto-generated error handling for Ynab Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ynab
 */

/**
 * Error type enum
 */
export enum YnabErrorType {
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
 * Ynab Error class
 *
 * Custom error class for Ynab Integration operations.
 */
export class YnabError extends Error {
  public readonly code: string | number
  public readonly type: YnabErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: YnabErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'YnabError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YnabError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns YnabError instance
   */
  static fromError(error: any): YnabError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: YnabErrorType; retryable: boolean }> = {
      '401': { type: YnabErrorType.Authentication, retryable: false },
      '429': { type: YnabErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new YnabError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = YnabErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = YnabErrorType.Authentication
    } else if (statusCode === 403) {
      type = YnabErrorType.Authorization
    } else if (statusCode === 404) {
      type = YnabErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = YnabErrorType.Validation
    } else if (statusCode === 429) {
      type = YnabErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = YnabErrorType.Server
      retryable = true
    }

    return new YnabError(message, code, type, {
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
    return this.type === YnabErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === YnabErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === YnabErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === YnabErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === YnabErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === YnabErrorType.Server
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
