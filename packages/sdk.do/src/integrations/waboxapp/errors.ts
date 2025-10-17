/**
 * Waboxapp Errors
 *
 * Auto-generated error handling for Waboxapp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/waboxapp
 */

/**
 * Error type enum
 */
export enum WaboxappErrorType {
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
 * Waboxapp Error class
 *
 * Custom error class for Waboxapp Integration operations.
 */
export class WaboxappError extends Error {
  public readonly code: string | number
  public readonly type: WaboxappErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WaboxappErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WaboxappError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WaboxappError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WaboxappError instance
   */
  static fromError(error: any): WaboxappError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WaboxappErrorType; retryable: boolean }> = {
      '401': { type: WaboxappErrorType.Authentication, retryable: false },
      '429': { type: WaboxappErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WaboxappError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WaboxappErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WaboxappErrorType.Authentication
    } else if (statusCode === 403) {
      type = WaboxappErrorType.Authorization
    } else if (statusCode === 404) {
      type = WaboxappErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WaboxappErrorType.Validation
    } else if (statusCode === 429) {
      type = WaboxappErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WaboxappErrorType.Server
      retryable = true
    }

    return new WaboxappError(message, code, type, {
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
    return this.type === WaboxappErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WaboxappErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WaboxappErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WaboxappErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WaboxappErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WaboxappErrorType.Server
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
