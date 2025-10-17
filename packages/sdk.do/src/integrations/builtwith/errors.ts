/**
 * Builtwith Errors
 *
 * Auto-generated error handling for Builtwith Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/builtwith
 */

/**
 * Error type enum
 */
export enum BuiltwithErrorType {
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
 * Builtwith Error class
 *
 * Custom error class for Builtwith Integration operations.
 */
export class BuiltwithError extends Error {
  public readonly code: string | number
  public readonly type: BuiltwithErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BuiltwithErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BuiltwithError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BuiltwithError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BuiltwithError instance
   */
  static fromError(error: any): BuiltwithError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BuiltwithErrorType; retryable: boolean }> = {
      '401': { type: BuiltwithErrorType.Authentication, retryable: false },
      '429': { type: BuiltwithErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BuiltwithError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BuiltwithErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BuiltwithErrorType.Authentication
    } else if (statusCode === 403) {
      type = BuiltwithErrorType.Authorization
    } else if (statusCode === 404) {
      type = BuiltwithErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BuiltwithErrorType.Validation
    } else if (statusCode === 429) {
      type = BuiltwithErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BuiltwithErrorType.Server
      retryable = true
    }

    return new BuiltwithError(message, code, type, {
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
    return this.type === BuiltwithErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BuiltwithErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BuiltwithErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BuiltwithErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BuiltwithErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BuiltwithErrorType.Server
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
