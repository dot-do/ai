/**
 * Appsflyer Errors
 *
 * Auto-generated error handling for Appsflyer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/appsflyer
 */

/**
 * Error type enum
 */
export enum AppsflyerErrorType {
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
 * Appsflyer Error class
 *
 * Custom error class for Appsflyer Integration operations.
 */
export class AppsflyerError extends Error {
  public readonly code: string | number
  public readonly type: AppsflyerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AppsflyerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AppsflyerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppsflyerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AppsflyerError instance
   */
  static fromError(error: any): AppsflyerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AppsflyerErrorType; retryable: boolean }> = {
      '401': { type: AppsflyerErrorType.Authentication, retryable: false },
      '429': { type: AppsflyerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AppsflyerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AppsflyerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AppsflyerErrorType.Authentication
    } else if (statusCode === 403) {
      type = AppsflyerErrorType.Authorization
    } else if (statusCode === 404) {
      type = AppsflyerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AppsflyerErrorType.Validation
    } else if (statusCode === 429) {
      type = AppsflyerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AppsflyerErrorType.Server
      retryable = true
    }

    return new AppsflyerError(message, code, type, {
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
    return this.type === AppsflyerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AppsflyerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AppsflyerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AppsflyerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AppsflyerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AppsflyerErrorType.Server
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
