/**
 * SendGrid Errors
 *
 * Auto-generated error handling for SendGrid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sendgrid
 */

/**
 * Error type enum
 */
export enum SendgridErrorType {
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
 * SendGrid Error class
 *
 * Custom error class for SendGrid Integration operations.
 */
export class SendgridError extends Error {
  public readonly code: string | number
  public readonly type: SendgridErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SendgridErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SendgridError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SendgridError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SendgridError instance
   */
  static fromError(error: any): SendgridError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SendgridErrorType; retryable: boolean }> = {
      INVALID_REQUEST: { type: SendgridErrorType.Validation, retryable: false },
      AUTHENTICATION_FAILED: { type: SendgridErrorType.Authentication, retryable: false },
      PERMISSION_DENIED: { type: SendgridErrorType.Authorization, retryable: false },
      NOT_FOUND: { type: SendgridErrorType.NotFound, retryable: false },
      PAYLOAD_TOO_LARGE: { type: SendgridErrorType.Validation, retryable: false },
      RATE_LIMIT_EXCEEDED: { type: SendgridErrorType.RateLimit, retryable: true },
      SERVER_ERROR: { type: SendgridErrorType.Server, retryable: true },
      SERVICE_UNAVAILABLE: { type: SendgridErrorType.Server, retryable: true },
      TIMEOUT: { type: SendgridErrorType.Network, retryable: true },
      NETWORK_ERROR: { type: SendgridErrorType.Network, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SendgridError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SendgridErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SendgridErrorType.Authentication
    } else if (statusCode === 403) {
      type = SendgridErrorType.Authorization
    } else if (statusCode === 404) {
      type = SendgridErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SendgridErrorType.Validation
    } else if (statusCode === 429) {
      type = SendgridErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SendgridErrorType.Server
      retryable = true
    }

    return new SendgridError(message, code, type, {
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
    return this.type === SendgridErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SendgridErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SendgridErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SendgridErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SendgridErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SendgridErrorType.Server
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
