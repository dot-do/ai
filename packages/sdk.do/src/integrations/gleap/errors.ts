/**
 * Gleap Errors
 *
 * Auto-generated error handling for Gleap Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gleap
 */

/**
 * Error type enum
 */
export enum GleapErrorType {
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
 * Gleap Error class
 *
 * Custom error class for Gleap Integration operations.
 */
export class GleapError extends Error {
  public readonly code: string | number
  public readonly type: GleapErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GleapErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GleapError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GleapError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GleapError instance
   */
  static fromError(error: any): GleapError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GleapErrorType; retryable: boolean }> = {
      '401': { type: GleapErrorType.Authentication, retryable: false },
      '429': { type: GleapErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GleapError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GleapErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GleapErrorType.Authentication
    } else if (statusCode === 403) {
      type = GleapErrorType.Authorization
    } else if (statusCode === 404) {
      type = GleapErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GleapErrorType.Validation
    } else if (statusCode === 429) {
      type = GleapErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GleapErrorType.Server
      retryable = true
    }

    return new GleapError(message, code, type, {
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
    return this.type === GleapErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GleapErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GleapErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GleapErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GleapErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GleapErrorType.Server
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
