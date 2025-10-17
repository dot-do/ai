/**
 * Fireberry Errors
 *
 * Auto-generated error handling for Fireberry Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/fireberry
 */

/**
 * Error type enum
 */
export enum FireberryErrorType {
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
 * Fireberry Error class
 *
 * Custom error class for Fireberry Integration operations.
 */
export class FireberryError extends Error {
  public readonly code: string | number
  public readonly type: FireberryErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FireberryErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FireberryError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FireberryError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FireberryError instance
   */
  static fromError(error: any): FireberryError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FireberryErrorType; retryable: boolean }> = {
      '401': { type: FireberryErrorType.Authentication, retryable: false },
      '429': { type: FireberryErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FireberryError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FireberryErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FireberryErrorType.Authentication
    } else if (statusCode === 403) {
      type = FireberryErrorType.Authorization
    } else if (statusCode === 404) {
      type = FireberryErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FireberryErrorType.Validation
    } else if (statusCode === 429) {
      type = FireberryErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FireberryErrorType.Server
      retryable = true
    }

    return new FireberryError(message, code, type, {
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
    return this.type === FireberryErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FireberryErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FireberryErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FireberryErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FireberryErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FireberryErrorType.Server
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
