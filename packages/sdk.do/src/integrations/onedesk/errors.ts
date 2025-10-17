/**
 * Onedesk Errors
 *
 * Auto-generated error handling for Onedesk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onedesk
 */

/**
 * Error type enum
 */
export enum OnedeskErrorType {
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
 * Onedesk Error class
 *
 * Custom error class for Onedesk Integration operations.
 */
export class OnedeskError extends Error {
  public readonly code: string | number
  public readonly type: OnedeskErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OnedeskErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OnedeskError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OnedeskError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OnedeskError instance
   */
  static fromError(error: any): OnedeskError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OnedeskErrorType; retryable: boolean }> = {
      '401': { type: OnedeskErrorType.Authentication, retryable: false },
      '429': { type: OnedeskErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OnedeskError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OnedeskErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OnedeskErrorType.Authentication
    } else if (statusCode === 403) {
      type = OnedeskErrorType.Authorization
    } else if (statusCode === 404) {
      type = OnedeskErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OnedeskErrorType.Validation
    } else if (statusCode === 429) {
      type = OnedeskErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OnedeskErrorType.Server
      retryable = true
    }

    return new OnedeskError(message, code, type, {
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
    return this.type === OnedeskErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OnedeskErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OnedeskErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OnedeskErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OnedeskErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OnedeskErrorType.Server
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
