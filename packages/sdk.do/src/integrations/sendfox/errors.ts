/**
 * Sendfox Errors
 *
 * Auto-generated error handling for Sendfox Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sendfox
 */

/**
 * Error type enum
 */
export enum SendfoxErrorType {
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
 * Sendfox Error class
 *
 * Custom error class for Sendfox Integration operations.
 */
export class SendfoxError extends Error {
  public readonly code: string | number
  public readonly type: SendfoxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SendfoxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SendfoxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SendfoxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SendfoxError instance
   */
  static fromError(error: any): SendfoxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SendfoxErrorType; retryable: boolean }> = {
      '401': { type: SendfoxErrorType.Authentication, retryable: false },
      '429': { type: SendfoxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SendfoxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SendfoxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SendfoxErrorType.Authentication
    } else if (statusCode === 403) {
      type = SendfoxErrorType.Authorization
    } else if (statusCode === 404) {
      type = SendfoxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SendfoxErrorType.Validation
    } else if (statusCode === 429) {
      type = SendfoxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SendfoxErrorType.Server
      retryable = true
    }

    return new SendfoxError(message, code, type, {
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
    return this.type === SendfoxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SendfoxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SendfoxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SendfoxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SendfoxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SendfoxErrorType.Server
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
