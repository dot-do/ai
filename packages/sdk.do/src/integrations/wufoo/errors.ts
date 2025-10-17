/**
 * Wufoo Errors
 *
 * Auto-generated error handling for Wufoo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wufoo
 */

/**
 * Error type enum
 */
export enum WufooErrorType {
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
 * Wufoo Error class
 *
 * Custom error class for Wufoo Integration operations.
 */
export class WufooError extends Error {
  public readonly code: string | number
  public readonly type: WufooErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WufooErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WufooError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WufooError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WufooError instance
   */
  static fromError(error: any): WufooError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WufooErrorType; retryable: boolean }> = {
      '401': { type: WufooErrorType.Authentication, retryable: false },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WufooError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WufooErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WufooErrorType.Authentication
    } else if (statusCode === 403) {
      type = WufooErrorType.Authorization
    } else if (statusCode === 404) {
      type = WufooErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WufooErrorType.Validation
    } else if (statusCode === 429) {
      type = WufooErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WufooErrorType.Server
      retryable = true
    }

    return new WufooError(message, code, type, {
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
    return this.type === WufooErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WufooErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WufooErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WufooErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WufooErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WufooErrorType.Server
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
