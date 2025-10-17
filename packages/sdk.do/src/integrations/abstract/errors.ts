/**
 * Abstract Errors
 *
 * Auto-generated error handling for Abstract Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/abstract
 */

/**
 * Error type enum
 */
export enum AbstractErrorType {
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
 * Abstract Error class
 *
 * Custom error class for Abstract Integration operations.
 */
export class AbstractError extends Error {
  public readonly code: string | number
  public readonly type: AbstractErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AbstractErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AbstractError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AbstractError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AbstractError instance
   */
  static fromError(error: any): AbstractError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AbstractErrorType; retryable: boolean }> = {
      '401': { type: AbstractErrorType.Authentication, retryable: false },
      '429': { type: AbstractErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AbstractError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AbstractErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AbstractErrorType.Authentication
    } else if (statusCode === 403) {
      type = AbstractErrorType.Authorization
    } else if (statusCode === 404) {
      type = AbstractErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AbstractErrorType.Validation
    } else if (statusCode === 429) {
      type = AbstractErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AbstractErrorType.Server
      retryable = true
    }

    return new AbstractError(message, code, type, {
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
    return this.type === AbstractErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AbstractErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AbstractErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AbstractErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AbstractErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AbstractErrorType.Server
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
