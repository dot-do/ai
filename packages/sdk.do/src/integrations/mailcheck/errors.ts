/**
 * Mailcheck Errors
 *
 * Auto-generated error handling for Mailcheck Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailcheck
 */

/**
 * Error type enum
 */
export enum MailcheckErrorType {
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
 * Mailcheck Error class
 *
 * Custom error class for Mailcheck Integration operations.
 */
export class MailcheckError extends Error {
  public readonly code: string | number
  public readonly type: MailcheckErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MailcheckErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MailcheckError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MailcheckError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MailcheckError instance
   */
  static fromError(error: any): MailcheckError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MailcheckErrorType; retryable: boolean }> = {
      '401': { type: MailcheckErrorType.Authentication, retryable: false },
      '429': { type: MailcheckErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MailcheckError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MailcheckErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MailcheckErrorType.Authentication
    } else if (statusCode === 403) {
      type = MailcheckErrorType.Authorization
    } else if (statusCode === 404) {
      type = MailcheckErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MailcheckErrorType.Validation
    } else if (statusCode === 429) {
      type = MailcheckErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MailcheckErrorType.Server
      retryable = true
    }

    return new MailcheckError(message, code, type, {
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
    return this.type === MailcheckErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MailcheckErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MailcheckErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MailcheckErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MailcheckErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MailcheckErrorType.Server
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
