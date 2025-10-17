/**
 * Cal Errors
 *
 * Auto-generated error handling for Cal Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cal
 */

/**
 * Error type enum
 */
export enum CalErrorType {
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
 * Cal Error class
 *
 * Custom error class for Cal Integration operations.
 */
export class CalError extends Error {
  public readonly code: string | number
  public readonly type: CalErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CalErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CalError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CalError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CalError instance
   */
  static fromError(error: any): CalError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CalErrorType; retryable: boolean }> = {
      '401': { type: CalErrorType.Authentication, retryable: false },
      '429': { type: CalErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CalError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CalErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CalErrorType.Authentication
    } else if (statusCode === 403) {
      type = CalErrorType.Authorization
    } else if (statusCode === 404) {
      type = CalErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CalErrorType.Validation
    } else if (statusCode === 429) {
      type = CalErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CalErrorType.Server
      retryable = true
    }

    return new CalError(message, code, type, {
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
    return this.type === CalErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CalErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CalErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CalErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CalErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CalErrorType.Server
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
