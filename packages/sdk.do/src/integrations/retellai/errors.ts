/**
 * Retellai Errors
 *
 * Auto-generated error handling for Retellai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/retellai
 */

/**
 * Error type enum
 */
export enum RetellaiErrorType {
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
 * Retellai Error class
 *
 * Custom error class for Retellai Integration operations.
 */
export class RetellaiError extends Error {
  public readonly code: string | number
  public readonly type: RetellaiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RetellaiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RetellaiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RetellaiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RetellaiError instance
   */
  static fromError(error: any): RetellaiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RetellaiErrorType; retryable: boolean }> = {
      '401': { type: RetellaiErrorType.Authentication, retryable: false },
      '429': { type: RetellaiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RetellaiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RetellaiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RetellaiErrorType.Authentication
    } else if (statusCode === 403) {
      type = RetellaiErrorType.Authorization
    } else if (statusCode === 404) {
      type = RetellaiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RetellaiErrorType.Validation
    } else if (statusCode === 429) {
      type = RetellaiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RetellaiErrorType.Server
      retryable = true
    }

    return new RetellaiError(message, code, type, {
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
    return this.type === RetellaiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RetellaiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RetellaiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RetellaiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RetellaiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RetellaiErrorType.Server
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
