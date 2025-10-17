/**
 * Smartproxy Errors
 *
 * Auto-generated error handling for Smartproxy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/smartproxy
 */

/**
 * Error type enum
 */
export enum SmartproxyErrorType {
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
 * Smartproxy Error class
 *
 * Custom error class for Smartproxy Integration operations.
 */
export class SmartproxyError extends Error {
  public readonly code: string | number
  public readonly type: SmartproxyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SmartproxyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SmartproxyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SmartproxyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SmartproxyError instance
   */
  static fromError(error: any): SmartproxyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SmartproxyErrorType; retryable: boolean }> = {
      '401': { type: SmartproxyErrorType.Authentication, retryable: false },
      '429': { type: SmartproxyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SmartproxyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SmartproxyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SmartproxyErrorType.Authentication
    } else if (statusCode === 403) {
      type = SmartproxyErrorType.Authorization
    } else if (statusCode === 404) {
      type = SmartproxyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SmartproxyErrorType.Validation
    } else if (statusCode === 429) {
      type = SmartproxyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SmartproxyErrorType.Server
      retryable = true
    }

    return new SmartproxyError(message, code, type, {
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
    return this.type === SmartproxyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SmartproxyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SmartproxyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SmartproxyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SmartproxyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SmartproxyErrorType.Server
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
