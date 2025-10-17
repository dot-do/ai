/**
 * Logo dev Errors
 *
 * Auto-generated error handling for Logo dev Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/logo_dev
 */

/**
 * Error type enum
 */
export enum LogoDevErrorType {
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
 * Logo dev Error class
 *
 * Custom error class for Logo dev Integration operations.
 */
export class LogoDevError extends Error {
  public readonly code: string | number
  public readonly type: LogoDevErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LogoDevErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LogoDevError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LogoDevError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LogoDevError instance
   */
  static fromError(error: any): LogoDevError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LogoDevErrorType; retryable: boolean }> = {
      '401': { type: LogoDevErrorType.Authentication, retryable: false },
      '429': { type: LogoDevErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LogoDevError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LogoDevErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LogoDevErrorType.Authentication
    } else if (statusCode === 403) {
      type = LogoDevErrorType.Authorization
    } else if (statusCode === 404) {
      type = LogoDevErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LogoDevErrorType.Validation
    } else if (statusCode === 429) {
      type = LogoDevErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LogoDevErrorType.Server
      retryable = true
    }

    return new LogoDevError(message, code, type, {
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
    return this.type === LogoDevErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LogoDevErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LogoDevErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LogoDevErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LogoDevErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LogoDevErrorType.Server
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
