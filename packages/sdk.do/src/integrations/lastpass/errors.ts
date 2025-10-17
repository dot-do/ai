/**
 * Lastpass Errors
 *
 * Auto-generated error handling for Lastpass Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lastpass
 */

/**
 * Error type enum
 */
export enum LastpassErrorType {
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
 * Lastpass Error class
 *
 * Custom error class for Lastpass Integration operations.
 */
export class LastpassError extends Error {
  public readonly code: string | number
  public readonly type: LastpassErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LastpassErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LastpassError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LastpassError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LastpassError instance
   */
  static fromError(error: any): LastpassError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LastpassErrorType; retryable: boolean }> = {
      '401': { type: LastpassErrorType.Authentication, retryable: false },
      '429': { type: LastpassErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LastpassError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LastpassErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LastpassErrorType.Authentication
    } else if (statusCode === 403) {
      type = LastpassErrorType.Authorization
    } else if (statusCode === 404) {
      type = LastpassErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LastpassErrorType.Validation
    } else if (statusCode === 429) {
      type = LastpassErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LastpassErrorType.Server
      retryable = true
    }

    return new LastpassError(message, code, type, {
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
    return this.type === LastpassErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LastpassErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LastpassErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LastpassErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LastpassErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LastpassErrorType.Server
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
