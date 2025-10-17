/**
 * Strava Errors
 *
 * Auto-generated error handling for Strava Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/strava
 */

/**
 * Error type enum
 */
export enum StravaErrorType {
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
 * Strava Error class
 *
 * Custom error class for Strava Integration operations.
 */
export class StravaError extends Error {
  public readonly code: string | number
  public readonly type: StravaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: StravaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'StravaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StravaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns StravaError instance
   */
  static fromError(error: any): StravaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: StravaErrorType; retryable: boolean }> = {
      '401': { type: StravaErrorType.Authentication, retryable: false },
      '429': { type: StravaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new StravaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = StravaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = StravaErrorType.Authentication
    } else if (statusCode === 403) {
      type = StravaErrorType.Authorization
    } else if (statusCode === 404) {
      type = StravaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = StravaErrorType.Validation
    } else if (statusCode === 429) {
      type = StravaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = StravaErrorType.Server
      retryable = true
    }

    return new StravaError(message, code, type, {
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
    return this.type === StravaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === StravaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === StravaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === StravaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === StravaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === StravaErrorType.Server
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
