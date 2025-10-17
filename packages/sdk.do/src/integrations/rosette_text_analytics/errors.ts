/**
 * Rosette text analytics Errors
 *
 * Auto-generated error handling for Rosette text analytics Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rosette_text_analytics
 */

/**
 * Error type enum
 */
export enum RosetteTextAnalyticsErrorType {
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
 * Rosette text analytics Error class
 *
 * Custom error class for Rosette text analytics Integration operations.
 */
export class RosetteTextAnalyticsError extends Error {
  public readonly code: string | number
  public readonly type: RosetteTextAnalyticsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RosetteTextAnalyticsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RosetteTextAnalyticsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RosetteTextAnalyticsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RosetteTextAnalyticsError instance
   */
  static fromError(error: any): RosetteTextAnalyticsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RosetteTextAnalyticsErrorType; retryable: boolean }> = {
      '401': { type: RosetteTextAnalyticsErrorType.Authentication, retryable: false },
      '429': { type: RosetteTextAnalyticsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RosetteTextAnalyticsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RosetteTextAnalyticsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RosetteTextAnalyticsErrorType.Authentication
    } else if (statusCode === 403) {
      type = RosetteTextAnalyticsErrorType.Authorization
    } else if (statusCode === 404) {
      type = RosetteTextAnalyticsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RosetteTextAnalyticsErrorType.Validation
    } else if (statusCode === 429) {
      type = RosetteTextAnalyticsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RosetteTextAnalyticsErrorType.Server
      retryable = true
    }

    return new RosetteTextAnalyticsError(message, code, type, {
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
    return this.type === RosetteTextAnalyticsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RosetteTextAnalyticsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RosetteTextAnalyticsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RosetteTextAnalyticsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RosetteTextAnalyticsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RosetteTextAnalyticsErrorType.Server
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
