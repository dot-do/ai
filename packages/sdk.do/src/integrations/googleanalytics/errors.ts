/**
 * Google Analytics Errors
 *
 * Auto-generated error handling for Google Analytics Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googleanalytics
 */

/**
 * Error type enum
 */
export enum GoogleanalyticsErrorType {
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
export class GoogleanalyticsError extends Error {
  public readonly code: string | number
  public readonly type: GoogleanalyticsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleanalyticsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleanalyticsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleanalyticsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleanalyticsError instance
   */
  static fromError(error: any): GoogleanalyticsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleanalyticsErrorType; retryable: boolean }> = {
      '401': { type: GoogleanalyticsErrorType.Authentication, retryable: false },
      '403': { type: GoogleanalyticsErrorType.Authorization, retryable: false },
      '429': { type: GoogleanalyticsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleanalyticsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleanalyticsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleanalyticsErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleanalyticsErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleanalyticsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleanalyticsErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleanalyticsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleanalyticsErrorType.Server
      retryable = true
    }

    return new GoogleanalyticsError(message, code, type, {
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
    return this.type === GoogleanalyticsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleanalyticsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleanalyticsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleanalyticsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleanalyticsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleanalyticsErrorType.Server
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
