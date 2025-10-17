/**
 * Reply io Errors
 *
 * Auto-generated error handling for Reply io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/reply_io
 */

/**
 * Error type enum
 */
export enum ReplyIoErrorType {
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
 * Reply io Error class
 *
 * Custom error class for Reply io Integration operations.
 */
export class ReplyIoError extends Error {
  public readonly code: string | number
  public readonly type: ReplyIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ReplyIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ReplyIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ReplyIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ReplyIoError instance
   */
  static fromError(error: any): ReplyIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ReplyIoErrorType; retryable: boolean }> = {
      '401': { type: ReplyIoErrorType.Authentication, retryable: false },
      '429': { type: ReplyIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ReplyIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ReplyIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ReplyIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = ReplyIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = ReplyIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ReplyIoErrorType.Validation
    } else if (statusCode === 429) {
      type = ReplyIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ReplyIoErrorType.Server
      retryable = true
    }

    return new ReplyIoError(message, code, type, {
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
    return this.type === ReplyIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ReplyIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ReplyIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ReplyIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ReplyIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ReplyIoErrorType.Server
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
