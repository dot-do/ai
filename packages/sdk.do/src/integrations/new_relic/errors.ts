/**
 * New relic Errors
 *
 * Auto-generated error handling for New relic Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/new_relic
 */

/**
 * Error type enum
 */
export enum NewRelicErrorType {
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
 * New relic Error class
 *
 * Custom error class for New relic Integration operations.
 */
export class NewRelicError extends Error {
  public readonly code: string | number
  public readonly type: NewRelicErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NewRelicErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NewRelicError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NewRelicError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NewRelicError instance
   */
  static fromError(error: any): NewRelicError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NewRelicErrorType; retryable: boolean }> = {
      '401': { type: NewRelicErrorType.Authentication, retryable: false },
      '429': { type: NewRelicErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NewRelicError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NewRelicErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NewRelicErrorType.Authentication
    } else if (statusCode === 403) {
      type = NewRelicErrorType.Authorization
    } else if (statusCode === 404) {
      type = NewRelicErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NewRelicErrorType.Validation
    } else if (statusCode === 429) {
      type = NewRelicErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NewRelicErrorType.Server
      retryable = true
    }

    return new NewRelicError(message, code, type, {
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
    return this.type === NewRelicErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NewRelicErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NewRelicErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NewRelicErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NewRelicErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NewRelicErrorType.Server
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
