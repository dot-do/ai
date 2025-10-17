/**
 * Ably Errors
 *
 * Auto-generated error handling for Ably Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ably
 */

/**
 * Error type enum
 */
export enum AblyErrorType {
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
 * Ably Error class
 *
 * Custom error class for Ably Integration operations.
 */
export class AblyError extends Error {
  public readonly code: string | number
  public readonly type: AblyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AblyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AblyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AblyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AblyError instance
   */
  static fromError(error: any): AblyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AblyErrorType; retryable: boolean }> = {
      '401': { type: AblyErrorType.Authentication, retryable: false },
      '429': { type: AblyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AblyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AblyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AblyErrorType.Authentication
    } else if (statusCode === 403) {
      type = AblyErrorType.Authorization
    } else if (statusCode === 404) {
      type = AblyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AblyErrorType.Validation
    } else if (statusCode === 429) {
      type = AblyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AblyErrorType.Server
      retryable = true
    }

    return new AblyError(message, code, type, {
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
    return this.type === AblyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AblyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AblyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AblyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AblyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AblyErrorType.Server
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
