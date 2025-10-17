/**
 * Calendarhero Errors
 *
 * Auto-generated error handling for Calendarhero Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/calendarhero
 */

/**
 * Error type enum
 */
export enum CalendarheroErrorType {
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
 * Calendarhero Error class
 *
 * Custom error class for Calendarhero Integration operations.
 */
export class CalendarheroError extends Error {
  public readonly code: string | number
  public readonly type: CalendarheroErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CalendarheroErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CalendarheroError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CalendarheroError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CalendarheroError instance
   */
  static fromError(error: any): CalendarheroError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CalendarheroErrorType; retryable: boolean }> = {
      '401': { type: CalendarheroErrorType.Authentication, retryable: false },
      '429': { type: CalendarheroErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CalendarheroError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CalendarheroErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CalendarheroErrorType.Authentication
    } else if (statusCode === 403) {
      type = CalendarheroErrorType.Authorization
    } else if (statusCode === 404) {
      type = CalendarheroErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CalendarheroErrorType.Validation
    } else if (statusCode === 429) {
      type = CalendarheroErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CalendarheroErrorType.Server
      retryable = true
    }

    return new CalendarheroError(message, code, type, {
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
    return this.type === CalendarheroErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CalendarheroErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CalendarheroErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CalendarheroErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CalendarheroErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CalendarheroErrorType.Server
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
