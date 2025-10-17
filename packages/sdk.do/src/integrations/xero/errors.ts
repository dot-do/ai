/**
 * Xero Errors
 *
 * Auto-generated error handling for Xero Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/xero
 */

/**
 * Error type enum
 */
export enum XeroErrorType {
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
 * Xero Error class
 *
 * Custom error class for Xero Integration operations.
 */
export class XeroError extends Error {
  public readonly code: string | number
  public readonly type: XeroErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: XeroErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'XeroError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, XeroError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns XeroError instance
   */
  static fromError(error: any): XeroError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: XeroErrorType; retryable: boolean }> = {
      '401': { type: XeroErrorType.Authentication, retryable: false },
      '429': { type: XeroErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new XeroError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = XeroErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = XeroErrorType.Authentication
    } else if (statusCode === 403) {
      type = XeroErrorType.Authorization
    } else if (statusCode === 404) {
      type = XeroErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = XeroErrorType.Validation
    } else if (statusCode === 429) {
      type = XeroErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = XeroErrorType.Server
      retryable = true
    }

    return new XeroError(message, code, type, {
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
    return this.type === XeroErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === XeroErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === XeroErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === XeroErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === XeroErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === XeroErrorType.Server
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
