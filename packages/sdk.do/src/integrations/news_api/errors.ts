/**
 * News api Errors
 *
 * Auto-generated error handling for News api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/news_api
 */

/**
 * Error type enum
 */
export enum NewsApiErrorType {
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
 * News api Error class
 *
 * Custom error class for News api Integration operations.
 */
export class NewsApiError extends Error {
  public readonly code: string | number
  public readonly type: NewsApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NewsApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NewsApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NewsApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NewsApiError instance
   */
  static fromError(error: any): NewsApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NewsApiErrorType; retryable: boolean }> = {
      '401': { type: NewsApiErrorType.Authentication, retryable: false },
      '429': { type: NewsApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NewsApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NewsApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NewsApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = NewsApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = NewsApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NewsApiErrorType.Validation
    } else if (statusCode === 429) {
      type = NewsApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NewsApiErrorType.Server
      retryable = true
    }

    return new NewsApiError(message, code, type, {
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
    return this.type === NewsApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NewsApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NewsApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NewsApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NewsApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NewsApiErrorType.Server
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
