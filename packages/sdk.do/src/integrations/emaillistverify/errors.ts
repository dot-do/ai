/**
 * Emaillistverify Errors
 *
 * Auto-generated error handling for Emaillistverify Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/emaillistverify
 */

/**
 * Error type enum
 */
export enum EmaillistverifyErrorType {
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
 * Emaillistverify Error class
 *
 * Custom error class for Emaillistverify Integration operations.
 */
export class EmaillistverifyError extends Error {
  public readonly code: string | number
  public readonly type: EmaillistverifyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EmaillistverifyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EmaillistverifyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmaillistverifyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EmaillistverifyError instance
   */
  static fromError(error: any): EmaillistverifyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EmaillistverifyErrorType; retryable: boolean }> = {
      '401': { type: EmaillistverifyErrorType.Authentication, retryable: false },
      '429': { type: EmaillistverifyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EmaillistverifyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EmaillistverifyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EmaillistverifyErrorType.Authentication
    } else if (statusCode === 403) {
      type = EmaillistverifyErrorType.Authorization
    } else if (statusCode === 404) {
      type = EmaillistverifyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EmaillistverifyErrorType.Validation
    } else if (statusCode === 429) {
      type = EmaillistverifyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EmaillistverifyErrorType.Server
      retryable = true
    }

    return new EmaillistverifyError(message, code, type, {
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
    return this.type === EmaillistverifyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EmaillistverifyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EmaillistverifyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EmaillistverifyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EmaillistverifyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EmaillistverifyErrorType.Server
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
