/**
 * Lemon squeezy Errors
 *
 * Auto-generated error handling for Lemon squeezy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lemon_squeezy
 */

/**
 * Error type enum
 */
export enum LemonSqueezyErrorType {
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
 * Lemon squeezy Error class
 *
 * Custom error class for Lemon squeezy Integration operations.
 */
export class LemonSqueezyError extends Error {
  public readonly code: string | number
  public readonly type: LemonSqueezyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LemonSqueezyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LemonSqueezyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LemonSqueezyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LemonSqueezyError instance
   */
  static fromError(error: any): LemonSqueezyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LemonSqueezyErrorType; retryable: boolean }> = {
      '401': { type: LemonSqueezyErrorType.Authentication, retryable: false },
      '429': { type: LemonSqueezyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LemonSqueezyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LemonSqueezyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LemonSqueezyErrorType.Authentication
    } else if (statusCode === 403) {
      type = LemonSqueezyErrorType.Authorization
    } else if (statusCode === 404) {
      type = LemonSqueezyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LemonSqueezyErrorType.Validation
    } else if (statusCode === 429) {
      type = LemonSqueezyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LemonSqueezyErrorType.Server
      retryable = true
    }

    return new LemonSqueezyError(message, code, type, {
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
    return this.type === LemonSqueezyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LemonSqueezyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LemonSqueezyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LemonSqueezyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LemonSqueezyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LemonSqueezyErrorType.Server
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
