/**
 * Rippling Errors
 *
 * Auto-generated error handling for Rippling Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rippling
 */

/**
 * Error type enum
 */
export enum RipplingErrorType {
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
 * Rippling Error class
 *
 * Custom error class for Rippling Integration operations.
 */
export class RipplingError extends Error {
  public readonly code: string | number
  public readonly type: RipplingErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RipplingErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RipplingError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RipplingError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RipplingError instance
   */
  static fromError(error: any): RipplingError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RipplingErrorType; retryable: boolean }> = {
      '401': { type: RipplingErrorType.Authentication, retryable: false },
      '429': { type: RipplingErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RipplingError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RipplingErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RipplingErrorType.Authentication
    } else if (statusCode === 403) {
      type = RipplingErrorType.Authorization
    } else if (statusCode === 404) {
      type = RipplingErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RipplingErrorType.Validation
    } else if (statusCode === 429) {
      type = RipplingErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RipplingErrorType.Server
      retryable = true
    }

    return new RipplingError(message, code, type, {
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
    return this.type === RipplingErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RipplingErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RipplingErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RipplingErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RipplingErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RipplingErrorType.Server
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
