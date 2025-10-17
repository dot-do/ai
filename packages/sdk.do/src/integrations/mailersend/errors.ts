/**
 * Mailersend Errors
 *
 * Auto-generated error handling for Mailersend Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailersend
 */

/**
 * Error type enum
 */
export enum MailersendErrorType {
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
 * Mailersend Error class
 *
 * Custom error class for Mailersend Integration operations.
 */
export class MailersendError extends Error {
  public readonly code: string | number
  public readonly type: MailersendErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MailersendErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MailersendError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MailersendError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MailersendError instance
   */
  static fromError(error: any): MailersendError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MailersendErrorType; retryable: boolean }> = {
      '401': { type: MailersendErrorType.Authentication, retryable: false },
      '429': { type: MailersendErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MailersendError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MailersendErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MailersendErrorType.Authentication
    } else if (statusCode === 403) {
      type = MailersendErrorType.Authorization
    } else if (statusCode === 404) {
      type = MailersendErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MailersendErrorType.Validation
    } else if (statusCode === 429) {
      type = MailersendErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MailersendErrorType.Server
      retryable = true
    }

    return new MailersendError(message, code, type, {
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
    return this.type === MailersendErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MailersendErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MailersendErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MailersendErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MailersendErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MailersendErrorType.Server
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
