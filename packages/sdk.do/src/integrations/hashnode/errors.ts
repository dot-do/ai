/**
 * Hashnode Errors
 *
 * Auto-generated error handling for Hashnode Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hashnode
 */

/**
 * Error type enum
 */
export enum HashnodeErrorType {
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
 * Hashnode Error class
 *
 * Custom error class for Hashnode Integration operations.
 */
export class HashnodeError extends Error {
  public readonly code: string | number
  public readonly type: HashnodeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HashnodeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HashnodeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HashnodeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HashnodeError instance
   */
  static fromError(error: any): HashnodeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HashnodeErrorType; retryable: boolean }> = {
      '401': { type: HashnodeErrorType.Authentication, retryable: false },
      '429': { type: HashnodeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HashnodeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HashnodeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HashnodeErrorType.Authentication
    } else if (statusCode === 403) {
      type = HashnodeErrorType.Authorization
    } else if (statusCode === 404) {
      type = HashnodeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HashnodeErrorType.Validation
    } else if (statusCode === 429) {
      type = HashnodeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HashnodeErrorType.Server
      retryable = true
    }

    return new HashnodeError(message, code, type, {
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
    return this.type === HashnodeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HashnodeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HashnodeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HashnodeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HashnodeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HashnodeErrorType.Server
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
