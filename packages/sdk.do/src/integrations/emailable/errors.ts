/**
 * Emailable Errors
 *
 * Auto-generated error handling for Emailable Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/emailable
 */

/**
 * Error type enum
 */
export enum EmailableErrorType {
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
 * Emailable Error class
 *
 * Custom error class for Emailable Integration operations.
 */
export class EmailableError extends Error {
  public readonly code: string | number
  public readonly type: EmailableErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EmailableErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EmailableError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmailableError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EmailableError instance
   */
  static fromError(error: any): EmailableError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EmailableErrorType; retryable: boolean }> = {
      '401': { type: EmailableErrorType.Authentication, retryable: false },
      '429': { type: EmailableErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EmailableError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EmailableErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EmailableErrorType.Authentication
    } else if (statusCode === 403) {
      type = EmailableErrorType.Authorization
    } else if (statusCode === 404) {
      type = EmailableErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EmailableErrorType.Validation
    } else if (statusCode === 429) {
      type = EmailableErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EmailableErrorType.Server
      retryable = true
    }

    return new EmailableError(message, code, type, {
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
    return this.type === EmailableErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EmailableErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EmailableErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EmailableErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EmailableErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EmailableErrorType.Server
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
