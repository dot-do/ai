/**
 * Dotsimple Errors
 *
 * Auto-generated error handling for Dotsimple Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dotsimple
 */

/**
 * Error type enum
 */
export enum DotsimpleErrorType {
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
 * Dotsimple Error class
 *
 * Custom error class for Dotsimple Integration operations.
 */
export class DotsimpleError extends Error {
  public readonly code: string | number
  public readonly type: DotsimpleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DotsimpleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DotsimpleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DotsimpleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DotsimpleError instance
   */
  static fromError(error: any): DotsimpleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DotsimpleErrorType; retryable: boolean }> = {
      '401': { type: DotsimpleErrorType.Authentication, retryable: false },
      '429': { type: DotsimpleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DotsimpleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DotsimpleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DotsimpleErrorType.Authentication
    } else if (statusCode === 403) {
      type = DotsimpleErrorType.Authorization
    } else if (statusCode === 404) {
      type = DotsimpleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DotsimpleErrorType.Validation
    } else if (statusCode === 429) {
      type = DotsimpleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DotsimpleErrorType.Server
      retryable = true
    }

    return new DotsimpleError(message, code, type, {
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
    return this.type === DotsimpleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DotsimpleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DotsimpleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DotsimpleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DotsimpleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DotsimpleErrorType.Server
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
