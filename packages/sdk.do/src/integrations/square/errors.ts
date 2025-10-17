/**
 * Square Errors
 *
 * Auto-generated error handling for Square Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/square
 */

/**
 * Error type enum
 */
export enum SquareErrorType {
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
 * Square Error class
 *
 * Custom error class for Square Integration operations.
 */
export class SquareError extends Error {
  public readonly code: string | number
  public readonly type: SquareErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SquareErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SquareError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SquareError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SquareError instance
   */
  static fromError(error: any): SquareError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SquareErrorType; retryable: boolean }> = {
      UNAUTHORIZED: { type: SquareErrorType.Authentication, retryable: false },
      FORBIDDEN: { type: SquareErrorType.Authorization, retryable: false },
      NOT_FOUND: { type: SquareErrorType.NotFound, retryable: false },
      BAD_REQUEST: { type: SquareErrorType.Validation, retryable: false },
      RATE_LIMITED: { type: SquareErrorType.RateLimit, retryable: true },
      INTERNAL_SERVER_ERROR: { type: SquareErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SquareError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SquareErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SquareErrorType.Authentication
    } else if (statusCode === 403) {
      type = SquareErrorType.Authorization
    } else if (statusCode === 404) {
      type = SquareErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SquareErrorType.Validation
    } else if (statusCode === 429) {
      type = SquareErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SquareErrorType.Server
      retryable = true
    }

    return new SquareError(message, code, type, {
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
    return this.type === SquareErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SquareErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SquareErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SquareErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SquareErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SquareErrorType.Server
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
