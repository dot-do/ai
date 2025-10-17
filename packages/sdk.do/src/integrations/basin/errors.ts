/**
 * Basin Errors
 *
 * Auto-generated error handling for Basin Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/basin
 */

/**
 * Error type enum
 */
export enum BasinErrorType {
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
 * Basin Error class
 *
 * Custom error class for Basin Integration operations.
 */
export class BasinError extends Error {
  public readonly code: string | number
  public readonly type: BasinErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BasinErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BasinError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BasinError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BasinError instance
   */
  static fromError(error: any): BasinError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BasinErrorType; retryable: boolean }> = {
      '401': { type: BasinErrorType.Authentication, retryable: false },
      '429': { type: BasinErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BasinError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BasinErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BasinErrorType.Authentication
    } else if (statusCode === 403) {
      type = BasinErrorType.Authorization
    } else if (statusCode === 404) {
      type = BasinErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BasinErrorType.Validation
    } else if (statusCode === 429) {
      type = BasinErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BasinErrorType.Server
      retryable = true
    }

    return new BasinError(message, code, type, {
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
    return this.type === BasinErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BasinErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BasinErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BasinErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BasinErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BasinErrorType.Server
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
