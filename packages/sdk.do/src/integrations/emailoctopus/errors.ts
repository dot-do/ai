/**
 * Emailoctopus Errors
 *
 * Auto-generated error handling for Emailoctopus Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/emailoctopus
 */

/**
 * Error type enum
 */
export enum EmailoctopusErrorType {
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
 * Emailoctopus Error class
 *
 * Custom error class for Emailoctopus Integration operations.
 */
export class EmailoctopusError extends Error {
  public readonly code: string | number
  public readonly type: EmailoctopusErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EmailoctopusErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EmailoctopusError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmailoctopusError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EmailoctopusError instance
   */
  static fromError(error: any): EmailoctopusError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EmailoctopusErrorType; retryable: boolean }> = {
      '401': { type: EmailoctopusErrorType.Authentication, retryable: false },
      '429': { type: EmailoctopusErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EmailoctopusError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EmailoctopusErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EmailoctopusErrorType.Authentication
    } else if (statusCode === 403) {
      type = EmailoctopusErrorType.Authorization
    } else if (statusCode === 404) {
      type = EmailoctopusErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EmailoctopusErrorType.Validation
    } else if (statusCode === 429) {
      type = EmailoctopusErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EmailoctopusErrorType.Server
      retryable = true
    }

    return new EmailoctopusError(message, code, type, {
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
    return this.type === EmailoctopusErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EmailoctopusErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EmailoctopusErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EmailoctopusErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EmailoctopusErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EmailoctopusErrorType.Server
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
