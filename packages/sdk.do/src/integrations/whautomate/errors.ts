/**
 * Whautomate Errors
 *
 * Auto-generated error handling for Whautomate Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/whautomate
 */

/**
 * Error type enum
 */
export enum WhautomateErrorType {
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
 * Whautomate Error class
 *
 * Custom error class for Whautomate Integration operations.
 */
export class WhautomateError extends Error {
  public readonly code: string | number
  public readonly type: WhautomateErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WhautomateErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WhautomateError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WhautomateError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WhautomateError instance
   */
  static fromError(error: any): WhautomateError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WhautomateErrorType; retryable: boolean }> = {
      '401': { type: WhautomateErrorType.Authentication, retryable: false },
      '429': { type: WhautomateErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WhautomateError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WhautomateErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WhautomateErrorType.Authentication
    } else if (statusCode === 403) {
      type = WhautomateErrorType.Authorization
    } else if (statusCode === 404) {
      type = WhautomateErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WhautomateErrorType.Validation
    } else if (statusCode === 429) {
      type = WhautomateErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WhautomateErrorType.Server
      retryable = true
    }

    return new WhautomateError(message, code, type, {
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
    return this.type === WhautomateErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WhautomateErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WhautomateErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WhautomateErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WhautomateErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WhautomateErrorType.Server
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
