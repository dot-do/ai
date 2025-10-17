/**
 * Box Errors
 *
 * Auto-generated error handling for Box Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/box
 */

/**
 * Error type enum
 */
export enum BoxErrorType {
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
 * Box Error class
 *
 * Custom error class for Box Integration operations.
 */
export class BoxError extends Error {
  public readonly code: string | number
  public readonly type: BoxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BoxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BoxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BoxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BoxError instance
   */
  static fromError(error: any): BoxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BoxErrorType; retryable: boolean }> = {
      '401': { type: BoxErrorType.Authentication, retryable: false },
      '429': { type: BoxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BoxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BoxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BoxErrorType.Authentication
    } else if (statusCode === 403) {
      type = BoxErrorType.Authorization
    } else if (statusCode === 404) {
      type = BoxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BoxErrorType.Validation
    } else if (statusCode === 429) {
      type = BoxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BoxErrorType.Server
      retryable = true
    }

    return new BoxError(message, code, type, {
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
    return this.type === BoxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BoxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BoxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BoxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BoxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BoxErrorType.Server
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
