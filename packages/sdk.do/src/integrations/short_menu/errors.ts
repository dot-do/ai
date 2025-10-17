/**
 * Short menu Errors
 *
 * Auto-generated error handling for Short menu Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/short_menu
 */

/**
 * Error type enum
 */
export enum ShortMenuErrorType {
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
 * Short menu Error class
 *
 * Custom error class for Short menu Integration operations.
 */
export class ShortMenuError extends Error {
  public readonly code: string | number
  public readonly type: ShortMenuErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ShortMenuErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ShortMenuError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShortMenuError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ShortMenuError instance
   */
  static fromError(error: any): ShortMenuError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ShortMenuErrorType; retryable: boolean }> = {
      '401': { type: ShortMenuErrorType.Authentication, retryable: false },
      '429': { type: ShortMenuErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ShortMenuError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ShortMenuErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ShortMenuErrorType.Authentication
    } else if (statusCode === 403) {
      type = ShortMenuErrorType.Authorization
    } else if (statusCode === 404) {
      type = ShortMenuErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ShortMenuErrorType.Validation
    } else if (statusCode === 429) {
      type = ShortMenuErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ShortMenuErrorType.Server
      retryable = true
    }

    return new ShortMenuError(message, code, type, {
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
    return this.type === ShortMenuErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ShortMenuErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ShortMenuErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ShortMenuErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ShortMenuErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ShortMenuErrorType.Server
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
