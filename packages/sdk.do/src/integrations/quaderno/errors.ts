/**
 * Quaderno Errors
 *
 * Auto-generated error handling for Quaderno Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/quaderno
 */

/**
 * Error type enum
 */
export enum QuadernoErrorType {
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
 * Quaderno Error class
 *
 * Custom error class for Quaderno Integration operations.
 */
export class QuadernoError extends Error {
  public readonly code: string | number
  public readonly type: QuadernoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: QuadernoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'QuadernoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QuadernoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns QuadernoError instance
   */
  static fromError(error: any): QuadernoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: QuadernoErrorType; retryable: boolean }> = {
      '401': { type: QuadernoErrorType.Authentication, retryable: false },
      '429': { type: QuadernoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new QuadernoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = QuadernoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = QuadernoErrorType.Authentication
    } else if (statusCode === 403) {
      type = QuadernoErrorType.Authorization
    } else if (statusCode === 404) {
      type = QuadernoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = QuadernoErrorType.Validation
    } else if (statusCode === 429) {
      type = QuadernoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = QuadernoErrorType.Server
      retryable = true
    }

    return new QuadernoError(message, code, type, {
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
    return this.type === QuadernoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === QuadernoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === QuadernoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === QuadernoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === QuadernoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === QuadernoErrorType.Server
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
