/**
 * Humanitix Errors
 *
 * Auto-generated error handling for Humanitix Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/humanitix
 */

/**
 * Error type enum
 */
export enum HumanitixErrorType {
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
 * Humanitix Error class
 *
 * Custom error class for Humanitix Integration operations.
 */
export class HumanitixError extends Error {
  public readonly code: string | number
  public readonly type: HumanitixErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HumanitixErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HumanitixError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HumanitixError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HumanitixError instance
   */
  static fromError(error: any): HumanitixError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HumanitixErrorType; retryable: boolean }> = {
      '401': { type: HumanitixErrorType.Authentication, retryable: false },
      '429': { type: HumanitixErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HumanitixError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HumanitixErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HumanitixErrorType.Authentication
    } else if (statusCode === 403) {
      type = HumanitixErrorType.Authorization
    } else if (statusCode === 404) {
      type = HumanitixErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HumanitixErrorType.Validation
    } else if (statusCode === 429) {
      type = HumanitixErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HumanitixErrorType.Server
      retryable = true
    }

    return new HumanitixError(message, code, type, {
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
    return this.type === HumanitixErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HumanitixErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HumanitixErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HumanitixErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HumanitixErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HumanitixErrorType.Server
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
