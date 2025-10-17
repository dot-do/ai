/**
 * Resend Errors
 *
 * Auto-generated error handling for Resend Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/resend
 */

/**
 * Error type enum
 */
export enum ResendErrorType {
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
 * Resend Error class
 *
 * Custom error class for Resend Integration operations.
 */
export class ResendError extends Error {
  public readonly code: string | number
  public readonly type: ResendErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ResendErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ResendError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResendError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ResendError instance
   */
  static fromError(error: any): ResendError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ResendErrorType; retryable: boolean }> = {
      '401': { type: ResendErrorType.Authentication, retryable: false },
      '429': { type: ResendErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ResendError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ResendErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ResendErrorType.Authentication
    } else if (statusCode === 403) {
      type = ResendErrorType.Authorization
    } else if (statusCode === 404) {
      type = ResendErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ResendErrorType.Validation
    } else if (statusCode === 429) {
      type = ResendErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ResendErrorType.Server
      retryable = true
    }

    return new ResendError(message, code, type, {
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
    return this.type === ResendErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ResendErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ResendErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ResendErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ResendErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ResendErrorType.Server
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
