/**
 * Dripcel Errors
 *
 * Auto-generated error handling for Dripcel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dripcel
 */

/**
 * Error type enum
 */
export enum DripcelErrorType {
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
 * Dripcel Error class
 *
 * Custom error class for Dripcel Integration operations.
 */
export class DripcelError extends Error {
  public readonly code: string | number
  public readonly type: DripcelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DripcelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DripcelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DripcelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DripcelError instance
   */
  static fromError(error: any): DripcelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DripcelErrorType; retryable: boolean }> = {
      '401': { type: DripcelErrorType.Authentication, retryable: false },
      '429': { type: DripcelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DripcelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DripcelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DripcelErrorType.Authentication
    } else if (statusCode === 403) {
      type = DripcelErrorType.Authorization
    } else if (statusCode === 404) {
      type = DripcelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DripcelErrorType.Validation
    } else if (statusCode === 429) {
      type = DripcelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DripcelErrorType.Server
      retryable = true
    }

    return new DripcelError(message, code, type, {
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
    return this.type === DripcelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DripcelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DripcelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DripcelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DripcelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DripcelErrorType.Server
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
