/**
 * Perigon Errors
 *
 * Auto-generated error handling for Perigon Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/perigon
 */

/**
 * Error type enum
 */
export enum PerigonErrorType {
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
 * Perigon Error class
 *
 * Custom error class for Perigon Integration operations.
 */
export class PerigonError extends Error {
  public readonly code: string | number
  public readonly type: PerigonErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PerigonErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PerigonError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PerigonError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PerigonError instance
   */
  static fromError(error: any): PerigonError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PerigonErrorType; retryable: boolean }> = {
      '401': { type: PerigonErrorType.Authentication, retryable: false },
      '429': { type: PerigonErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PerigonError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PerigonErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PerigonErrorType.Authentication
    } else if (statusCode === 403) {
      type = PerigonErrorType.Authorization
    } else if (statusCode === 404) {
      type = PerigonErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PerigonErrorType.Validation
    } else if (statusCode === 429) {
      type = PerigonErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PerigonErrorType.Server
      retryable = true
    }

    return new PerigonError(message, code, type, {
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
    return this.type === PerigonErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PerigonErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PerigonErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PerigonErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PerigonErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PerigonErrorType.Server
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
