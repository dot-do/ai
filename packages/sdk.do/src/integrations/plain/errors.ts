/**
 * Plain Errors
 *
 * Auto-generated error handling for Plain Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/plain
 */

/**
 * Error type enum
 */
export enum PlainErrorType {
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
 * Plain Error class
 *
 * Custom error class for Plain Integration operations.
 */
export class PlainError extends Error {
  public readonly code: string | number
  public readonly type: PlainErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PlainErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PlainError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PlainError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PlainError instance
   */
  static fromError(error: any): PlainError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PlainErrorType; retryable: boolean }> = {
      '401': { type: PlainErrorType.Authentication, retryable: false },
      '429': { type: PlainErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PlainError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PlainErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PlainErrorType.Authentication
    } else if (statusCode === 403) {
      type = PlainErrorType.Authorization
    } else if (statusCode === 404) {
      type = PlainErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PlainErrorType.Validation
    } else if (statusCode === 429) {
      type = PlainErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PlainErrorType.Server
      retryable = true
    }

    return new PlainError(message, code, type, {
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
    return this.type === PlainErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PlainErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PlainErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PlainErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PlainErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PlainErrorType.Server
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
