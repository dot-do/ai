/**
 * Mailsoftly Errors
 *
 * Auto-generated error handling for Mailsoftly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailsoftly
 */

/**
 * Error type enum
 */
export enum MailsoftlyErrorType {
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
 * Mailsoftly Error class
 *
 * Custom error class for Mailsoftly Integration operations.
 */
export class MailsoftlyError extends Error {
  public readonly code: string | number
  public readonly type: MailsoftlyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MailsoftlyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MailsoftlyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MailsoftlyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MailsoftlyError instance
   */
  static fromError(error: any): MailsoftlyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MailsoftlyErrorType; retryable: boolean }> = {
      '401': { type: MailsoftlyErrorType.Authentication, retryable: false },
      '429': { type: MailsoftlyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MailsoftlyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MailsoftlyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MailsoftlyErrorType.Authentication
    } else if (statusCode === 403) {
      type = MailsoftlyErrorType.Authorization
    } else if (statusCode === 404) {
      type = MailsoftlyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MailsoftlyErrorType.Validation
    } else if (statusCode === 429) {
      type = MailsoftlyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MailsoftlyErrorType.Server
      retryable = true
    }

    return new MailsoftlyError(message, code, type, {
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
    return this.type === MailsoftlyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MailsoftlyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MailsoftlyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MailsoftlyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MailsoftlyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MailsoftlyErrorType.Server
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
