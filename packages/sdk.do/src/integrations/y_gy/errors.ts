/**
 * Y gy Errors
 *
 * Auto-generated error handling for Y gy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/y_gy
 */

/**
 * Error type enum
 */
export enum YGyErrorType {
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
 * Y gy Error class
 *
 * Custom error class for Y gy Integration operations.
 */
export class YGyError extends Error {
  public readonly code: string | number
  public readonly type: YGyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: YGyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'YGyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YGyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns YGyError instance
   */
  static fromError(error: any): YGyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: YGyErrorType; retryable: boolean }> = {
      '401': { type: YGyErrorType.Authentication, retryable: false },
      '429': { type: YGyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new YGyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = YGyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = YGyErrorType.Authentication
    } else if (statusCode === 403) {
      type = YGyErrorType.Authorization
    } else if (statusCode === 404) {
      type = YGyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = YGyErrorType.Validation
    } else if (statusCode === 429) {
      type = YGyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = YGyErrorType.Server
      retryable = true
    }

    return new YGyError(message, code, type, {
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
    return this.type === YGyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === YGyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === YGyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === YGyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === YGyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === YGyErrorType.Server
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
