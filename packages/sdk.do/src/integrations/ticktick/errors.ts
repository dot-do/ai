/**
 * Ticktick Errors
 *
 * Auto-generated error handling for Ticktick Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ticktick
 */

/**
 * Error type enum
 */
export enum TicktickErrorType {
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
 * Ticktick Error class
 *
 * Custom error class for Ticktick Integration operations.
 */
export class TicktickError extends Error {
  public readonly code: string | number
  public readonly type: TicktickErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TicktickErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TicktickError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TicktickError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TicktickError instance
   */
  static fromError(error: any): TicktickError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TicktickErrorType; retryable: boolean }> = {
      '401': { type: TicktickErrorType.Authentication, retryable: false },
      '429': { type: TicktickErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TicktickError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TicktickErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TicktickErrorType.Authentication
    } else if (statusCode === 403) {
      type = TicktickErrorType.Authorization
    } else if (statusCode === 404) {
      type = TicktickErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TicktickErrorType.Validation
    } else if (statusCode === 429) {
      type = TicktickErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TicktickErrorType.Server
      retryable = true
    }

    return new TicktickError(message, code, type, {
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
    return this.type === TicktickErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TicktickErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TicktickErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TicktickErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TicktickErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TicktickErrorType.Server
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
