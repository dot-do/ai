/**
 * Qualaroo Errors
 *
 * Auto-generated error handling for Qualaroo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/qualaroo
 */

/**
 * Error type enum
 */
export enum QualarooErrorType {
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
 * Qualaroo Error class
 *
 * Custom error class for Qualaroo Integration operations.
 */
export class QualarooError extends Error {
  public readonly code: string | number
  public readonly type: QualarooErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: QualarooErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'QualarooError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QualarooError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns QualarooError instance
   */
  static fromError(error: any): QualarooError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: QualarooErrorType; retryable: boolean }> = {
      '401': { type: QualarooErrorType.Authentication, retryable: false },
      '429': { type: QualarooErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new QualarooError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = QualarooErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = QualarooErrorType.Authentication
    } else if (statusCode === 403) {
      type = QualarooErrorType.Authorization
    } else if (statusCode === 404) {
      type = QualarooErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = QualarooErrorType.Validation
    } else if (statusCode === 429) {
      type = QualarooErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = QualarooErrorType.Server
      retryable = true
    }

    return new QualarooError(message, code, type, {
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
    return this.type === QualarooErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === QualarooErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === QualarooErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === QualarooErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === QualarooErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === QualarooErrorType.Server
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
