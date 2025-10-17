/**
 * Webex Errors
 *
 * Auto-generated error handling for Webex Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/webex
 */

/**
 * Error type enum
 */
export enum WebexErrorType {
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
 * Webex Error class
 *
 * Custom error class for Webex Integration operations.
 */
export class WebexError extends Error {
  public readonly code: string | number
  public readonly type: WebexErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WebexErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WebexError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WebexError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WebexError instance
   */
  static fromError(error: any): WebexError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WebexErrorType; retryable: boolean }> = {
      '401': { type: WebexErrorType.Authentication, retryable: false },
      '429': { type: WebexErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WebexError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WebexErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WebexErrorType.Authentication
    } else if (statusCode === 403) {
      type = WebexErrorType.Authorization
    } else if (statusCode === 404) {
      type = WebexErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WebexErrorType.Validation
    } else if (statusCode === 429) {
      type = WebexErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WebexErrorType.Server
      retryable = true
    }

    return new WebexError(message, code, type, {
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
    return this.type === WebexErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WebexErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WebexErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WebexErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WebexErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WebexErrorType.Server
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
