/**
 * Wati Errors
 *
 * Auto-generated error handling for Wati Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wati
 */

/**
 * Error type enum
 */
export enum WatiErrorType {
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
 * Wati Error class
 *
 * Custom error class for Wati Integration operations.
 */
export class WatiError extends Error {
  public readonly code: string | number
  public readonly type: WatiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WatiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WatiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WatiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WatiError instance
   */
  static fromError(error: any): WatiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WatiErrorType; retryable: boolean }> = {
      '401': { type: WatiErrorType.Authentication, retryable: false },
      '429': { type: WatiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WatiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WatiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WatiErrorType.Authentication
    } else if (statusCode === 403) {
      type = WatiErrorType.Authorization
    } else if (statusCode === 404) {
      type = WatiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WatiErrorType.Validation
    } else if (statusCode === 429) {
      type = WatiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WatiErrorType.Server
      retryable = true
    }

    return new WatiError(message, code, type, {
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
    return this.type === WatiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WatiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WatiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WatiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WatiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WatiErrorType.Server
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
