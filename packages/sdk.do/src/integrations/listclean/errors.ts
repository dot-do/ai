/**
 * Listclean Errors
 *
 * Auto-generated error handling for Listclean Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/listclean
 */

/**
 * Error type enum
 */
export enum ListcleanErrorType {
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
 * Listclean Error class
 *
 * Custom error class for Listclean Integration operations.
 */
export class ListcleanError extends Error {
  public readonly code: string | number
  public readonly type: ListcleanErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ListcleanErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ListcleanError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ListcleanError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ListcleanError instance
   */
  static fromError(error: any): ListcleanError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ListcleanErrorType; retryable: boolean }> = {
      '401': { type: ListcleanErrorType.Authentication, retryable: false },
      '429': { type: ListcleanErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ListcleanError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ListcleanErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ListcleanErrorType.Authentication
    } else if (statusCode === 403) {
      type = ListcleanErrorType.Authorization
    } else if (statusCode === 404) {
      type = ListcleanErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ListcleanErrorType.Validation
    } else if (statusCode === 429) {
      type = ListcleanErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ListcleanErrorType.Server
      retryable = true
    }

    return new ListcleanError(message, code, type, {
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
    return this.type === ListcleanErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ListcleanErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ListcleanErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ListcleanErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ListcleanErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ListcleanErrorType.Server
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
