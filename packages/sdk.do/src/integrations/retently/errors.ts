/**
 * Retently Errors
 *
 * Auto-generated error handling for Retently Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/retently
 */

/**
 * Error type enum
 */
export enum RetentlyErrorType {
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
 * Retently Error class
 *
 * Custom error class for Retently Integration operations.
 */
export class RetentlyError extends Error {
  public readonly code: string | number
  public readonly type: RetentlyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RetentlyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RetentlyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RetentlyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RetentlyError instance
   */
  static fromError(error: any): RetentlyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RetentlyErrorType; retryable: boolean }> = {
      '401': { type: RetentlyErrorType.Authentication, retryable: false },
      '429': { type: RetentlyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RetentlyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RetentlyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RetentlyErrorType.Authentication
    } else if (statusCode === 403) {
      type = RetentlyErrorType.Authorization
    } else if (statusCode === 404) {
      type = RetentlyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RetentlyErrorType.Validation
    } else if (statusCode === 429) {
      type = RetentlyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RetentlyErrorType.Server
      retryable = true
    }

    return new RetentlyError(message, code, type, {
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
    return this.type === RetentlyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RetentlyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RetentlyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RetentlyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RetentlyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RetentlyErrorType.Server
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
