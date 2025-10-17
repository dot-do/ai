/**
 * Leiga Errors
 *
 * Auto-generated error handling for Leiga Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/leiga
 */

/**
 * Error type enum
 */
export enum LeigaErrorType {
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
 * Leiga Error class
 *
 * Custom error class for Leiga Integration operations.
 */
export class LeigaError extends Error {
  public readonly code: string | number
  public readonly type: LeigaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LeigaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LeigaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LeigaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LeigaError instance
   */
  static fromError(error: any): LeigaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LeigaErrorType; retryable: boolean }> = {
      '401': { type: LeigaErrorType.Authentication, retryable: false },
      '429': { type: LeigaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LeigaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LeigaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LeigaErrorType.Authentication
    } else if (statusCode === 403) {
      type = LeigaErrorType.Authorization
    } else if (statusCode === 404) {
      type = LeigaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LeigaErrorType.Validation
    } else if (statusCode === 429) {
      type = LeigaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LeigaErrorType.Server
      retryable = true
    }

    return new LeigaError(message, code, type, {
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
    return this.type === LeigaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LeigaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LeigaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LeigaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LeigaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LeigaErrorType.Server
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
