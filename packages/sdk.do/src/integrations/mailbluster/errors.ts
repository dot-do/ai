/**
 * Mailbluster Errors
 *
 * Auto-generated error handling for Mailbluster Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailbluster
 */

/**
 * Error type enum
 */
export enum MailblusterErrorType {
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
 * Mailbluster Error class
 *
 * Custom error class for Mailbluster Integration operations.
 */
export class MailblusterError extends Error {
  public readonly code: string | number
  public readonly type: MailblusterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MailblusterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MailblusterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MailblusterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MailblusterError instance
   */
  static fromError(error: any): MailblusterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MailblusterErrorType; retryable: boolean }> = {
      '401': { type: MailblusterErrorType.Authentication, retryable: false },
      '429': { type: MailblusterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MailblusterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MailblusterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MailblusterErrorType.Authentication
    } else if (statusCode === 403) {
      type = MailblusterErrorType.Authorization
    } else if (statusCode === 404) {
      type = MailblusterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MailblusterErrorType.Validation
    } else if (statusCode === 429) {
      type = MailblusterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MailblusterErrorType.Server
      retryable = true
    }

    return new MailblusterError(message, code, type, {
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
    return this.type === MailblusterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MailblusterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MailblusterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MailblusterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MailblusterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MailblusterErrorType.Server
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
