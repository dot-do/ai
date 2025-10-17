/**
 * Keap Errors
 *
 * Auto-generated error handling for Keap Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/keap
 */

/**
 * Error type enum
 */
export enum KeapErrorType {
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
 * Keap Error class
 *
 * Custom error class for Keap Integration operations.
 */
export class KeapError extends Error {
  public readonly code: string | number
  public readonly type: KeapErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KeapErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KeapError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KeapError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KeapError instance
   */
  static fromError(error: any): KeapError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KeapErrorType; retryable: boolean }> = {
      '401': { type: KeapErrorType.Authentication, retryable: false },
      '429': { type: KeapErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KeapError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KeapErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KeapErrorType.Authentication
    } else if (statusCode === 403) {
      type = KeapErrorType.Authorization
    } else if (statusCode === 404) {
      type = KeapErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KeapErrorType.Validation
    } else if (statusCode === 429) {
      type = KeapErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KeapErrorType.Server
      retryable = true
    }

    return new KeapError(message, code, type, {
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
    return this.type === KeapErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KeapErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KeapErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KeapErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KeapErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KeapErrorType.Server
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
