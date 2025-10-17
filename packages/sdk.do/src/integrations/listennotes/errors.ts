/**
 * Listennotes Errors
 *
 * Auto-generated error handling for Listennotes Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/listennotes
 */

/**
 * Error type enum
 */
export enum ListennotesErrorType {
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
 * Listennotes Error class
 *
 * Custom error class for Listennotes Integration operations.
 */
export class ListennotesError extends Error {
  public readonly code: string | number
  public readonly type: ListennotesErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ListennotesErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ListennotesError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ListennotesError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ListennotesError instance
   */
  static fromError(error: any): ListennotesError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ListennotesErrorType; retryable: boolean }> = {
      '401': { type: ListennotesErrorType.Authentication, retryable: false },
      '429': { type: ListennotesErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ListennotesError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ListennotesErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ListennotesErrorType.Authentication
    } else if (statusCode === 403) {
      type = ListennotesErrorType.Authorization
    } else if (statusCode === 404) {
      type = ListennotesErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ListennotesErrorType.Validation
    } else if (statusCode === 429) {
      type = ListennotesErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ListennotesErrorType.Server
      retryable = true
    }

    return new ListennotesError(message, code, type, {
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
    return this.type === ListennotesErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ListennotesErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ListennotesErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ListennotesErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ListennotesErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ListennotesErrorType.Server
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
