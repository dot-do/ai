/**
 * Abuselpdb Errors
 *
 * Auto-generated error handling for Abuselpdb Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/abuselpdb
 */

/**
 * Error type enum
 */
export enum AbuselpdbErrorType {
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
 * Abuselpdb Error class
 *
 * Custom error class for Abuselpdb Integration operations.
 */
export class AbuselpdbError extends Error {
  public readonly code: string | number
  public readonly type: AbuselpdbErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AbuselpdbErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AbuselpdbError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AbuselpdbError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AbuselpdbError instance
   */
  static fromError(error: any): AbuselpdbError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AbuselpdbErrorType; retryable: boolean }> = {
      '401': { type: AbuselpdbErrorType.Authentication, retryable: false },
      '429': { type: AbuselpdbErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AbuselpdbError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AbuselpdbErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AbuselpdbErrorType.Authentication
    } else if (statusCode === 403) {
      type = AbuselpdbErrorType.Authorization
    } else if (statusCode === 404) {
      type = AbuselpdbErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AbuselpdbErrorType.Validation
    } else if (statusCode === 429) {
      type = AbuselpdbErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AbuselpdbErrorType.Server
      retryable = true
    }

    return new AbuselpdbError(message, code, type, {
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
    return this.type === AbuselpdbErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AbuselpdbErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AbuselpdbErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AbuselpdbErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AbuselpdbErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AbuselpdbErrorType.Server
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
