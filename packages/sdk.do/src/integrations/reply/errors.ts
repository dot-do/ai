/**
 * Reply Errors
 *
 * Auto-generated error handling for Reply Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/reply
 */

/**
 * Error type enum
 */
export enum ReplyErrorType {
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
 * Reply Error class
 *
 * Custom error class for Reply Integration operations.
 */
export class ReplyError extends Error {
  public readonly code: string | number
  public readonly type: ReplyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ReplyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ReplyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ReplyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ReplyError instance
   */
  static fromError(error: any): ReplyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ReplyErrorType; retryable: boolean }> = {
      '401': { type: ReplyErrorType.Authentication, retryable: false },
      '429': { type: ReplyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ReplyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ReplyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ReplyErrorType.Authentication
    } else if (statusCode === 403) {
      type = ReplyErrorType.Authorization
    } else if (statusCode === 404) {
      type = ReplyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ReplyErrorType.Validation
    } else if (statusCode === 429) {
      type = ReplyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ReplyErrorType.Server
      retryable = true
    }

    return new ReplyError(message, code, type, {
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
    return this.type === ReplyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ReplyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ReplyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ReplyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ReplyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ReplyErrorType.Server
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
