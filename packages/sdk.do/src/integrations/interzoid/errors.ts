/**
 * Interzoid Errors
 *
 * Auto-generated error handling for Interzoid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/interzoid
 */

/**
 * Error type enum
 */
export enum InterzoidErrorType {
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
 * Interzoid Error class
 *
 * Custom error class for Interzoid Integration operations.
 */
export class InterzoidError extends Error {
  public readonly code: string | number
  public readonly type: InterzoidErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: InterzoidErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'InterzoidError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InterzoidError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns InterzoidError instance
   */
  static fromError(error: any): InterzoidError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: InterzoidErrorType; retryable: boolean }> = {
      '401': { type: InterzoidErrorType.Authentication, retryable: false },
      '429': { type: InterzoidErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new InterzoidError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = InterzoidErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = InterzoidErrorType.Authentication
    } else if (statusCode === 403) {
      type = InterzoidErrorType.Authorization
    } else if (statusCode === 404) {
      type = InterzoidErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = InterzoidErrorType.Validation
    } else if (statusCode === 429) {
      type = InterzoidErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = InterzoidErrorType.Server
      retryable = true
    }

    return new InterzoidError(message, code, type, {
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
    return this.type === InterzoidErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === InterzoidErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === InterzoidErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === InterzoidErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === InterzoidErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === InterzoidErrorType.Server
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
