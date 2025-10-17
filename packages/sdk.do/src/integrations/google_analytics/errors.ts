/**
 * Google Analytics Errors
 *
 * Auto-generated error handling for Google Analytics Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_analytics
 */

/**
 * Error type enum
 */
export enum GoogleAnalyticsErrorType {
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
 * Google Analytics Error class
 *
 * Custom error class for Google Analytics Integration operations.
 */
export class GoogleAnalyticsError extends Error {
  public readonly code: string | number
  public readonly type: GoogleAnalyticsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleAnalyticsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleAnalyticsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleAnalyticsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleAnalyticsError instance
   */
  static fromError(error: any): GoogleAnalyticsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleAnalyticsErrorType; retryable: boolean }> = {
      '401': { type: GoogleAnalyticsErrorType.Authentication, retryable: false },
      '429': { type: GoogleAnalyticsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleAnalyticsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleAnalyticsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleAnalyticsErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleAnalyticsErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleAnalyticsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleAnalyticsErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleAnalyticsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleAnalyticsErrorType.Server
      retryable = true
    }

    return new GoogleAnalyticsError(message, code, type, {
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
    return this.type === GoogleAnalyticsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleAnalyticsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleAnalyticsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleAnalyticsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleAnalyticsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleAnalyticsErrorType.Server
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
