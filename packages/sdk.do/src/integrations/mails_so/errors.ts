/**
 * Mails so Errors
 *
 * Auto-generated error handling for Mails so Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mails_so
 */

/**
 * Error type enum
 */
export enum MailsSoErrorType {
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
 * Mails so Error class
 *
 * Custom error class for Mails so Integration operations.
 */
export class MailsSoError extends Error {
  public readonly code: string | number
  public readonly type: MailsSoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MailsSoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MailsSoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MailsSoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MailsSoError instance
   */
  static fromError(error: any): MailsSoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MailsSoErrorType; retryable: boolean }> = {
      '401': { type: MailsSoErrorType.Authentication, retryable: false },
      '429': { type: MailsSoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MailsSoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MailsSoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MailsSoErrorType.Authentication
    } else if (statusCode === 403) {
      type = MailsSoErrorType.Authorization
    } else if (statusCode === 404) {
      type = MailsSoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MailsSoErrorType.Validation
    } else if (statusCode === 429) {
      type = MailsSoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MailsSoErrorType.Server
      retryable = true
    }

    return new MailsSoError(message, code, type, {
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
    return this.type === MailsSoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MailsSoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MailsSoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MailsSoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MailsSoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MailsSoErrorType.Server
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
