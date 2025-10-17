/**
 * Mailcoach Errors
 *
 * Auto-generated error handling for Mailcoach Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailcoach
 */

/**
 * Error type enum
 */
export enum MailcoachErrorType {
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
 * Mailcoach Error class
 *
 * Custom error class for Mailcoach Integration operations.
 */
export class MailcoachError extends Error {
  public readonly code: string | number
  public readonly type: MailcoachErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MailcoachErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MailcoachError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MailcoachError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MailcoachError instance
   */
  static fromError(error: any): MailcoachError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MailcoachErrorType; retryable: boolean }> = {
      '401': { type: MailcoachErrorType.Authentication, retryable: false },
      '429': { type: MailcoachErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MailcoachError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MailcoachErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MailcoachErrorType.Authentication
    } else if (statusCode === 403) {
      type = MailcoachErrorType.Authorization
    } else if (statusCode === 404) {
      type = MailcoachErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MailcoachErrorType.Validation
    } else if (statusCode === 429) {
      type = MailcoachErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MailcoachErrorType.Server
      retryable = true
    }

    return new MailcoachError(message, code, type, {
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
    return this.type === MailcoachErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MailcoachErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MailcoachErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MailcoachErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MailcoachErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MailcoachErrorType.Server
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
