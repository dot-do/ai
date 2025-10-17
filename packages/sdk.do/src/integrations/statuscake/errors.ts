/**
 * Statuscake Errors
 *
 * Auto-generated error handling for Statuscake Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/statuscake
 */

/**
 * Error type enum
 */
export enum StatuscakeErrorType {
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
 * Statuscake Error class
 *
 * Custom error class for Statuscake Integration operations.
 */
export class StatuscakeError extends Error {
  public readonly code: string | number
  public readonly type: StatuscakeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: StatuscakeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'StatuscakeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatuscakeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns StatuscakeError instance
   */
  static fromError(error: any): StatuscakeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: StatuscakeErrorType; retryable: boolean }> = {
      '401': { type: StatuscakeErrorType.Authentication, retryable: false },
      '429': { type: StatuscakeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new StatuscakeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = StatuscakeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = StatuscakeErrorType.Authentication
    } else if (statusCode === 403) {
      type = StatuscakeErrorType.Authorization
    } else if (statusCode === 404) {
      type = StatuscakeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = StatuscakeErrorType.Validation
    } else if (statusCode === 429) {
      type = StatuscakeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = StatuscakeErrorType.Server
      retryable = true
    }

    return new StatuscakeError(message, code, type, {
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
    return this.type === StatuscakeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === StatuscakeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === StatuscakeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === StatuscakeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === StatuscakeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === StatuscakeErrorType.Server
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
