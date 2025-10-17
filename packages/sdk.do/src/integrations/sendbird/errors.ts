/**
 * Sendbird Errors
 *
 * Auto-generated error handling for Sendbird Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sendbird
 */

/**
 * Error type enum
 */
export enum SendbirdErrorType {
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
 * Sendbird Error class
 *
 * Custom error class for Sendbird Integration operations.
 */
export class SendbirdError extends Error {
  public readonly code: string | number
  public readonly type: SendbirdErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SendbirdErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SendbirdError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SendbirdError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SendbirdError instance
   */
  static fromError(error: any): SendbirdError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SendbirdErrorType; retryable: boolean }> = {
      '401': { type: SendbirdErrorType.Authentication, retryable: false },
      '429': { type: SendbirdErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SendbirdError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SendbirdErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SendbirdErrorType.Authentication
    } else if (statusCode === 403) {
      type = SendbirdErrorType.Authorization
    } else if (statusCode === 404) {
      type = SendbirdErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SendbirdErrorType.Validation
    } else if (statusCode === 429) {
      type = SendbirdErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SendbirdErrorType.Server
      retryable = true
    }

    return new SendbirdError(message, code, type, {
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
    return this.type === SendbirdErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SendbirdErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SendbirdErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SendbirdErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SendbirdErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SendbirdErrorType.Server
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
