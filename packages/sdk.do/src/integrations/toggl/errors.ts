/**
 * Toggl Errors
 *
 * Auto-generated error handling for Toggl Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/toggl
 */

/**
 * Error type enum
 */
export enum TogglErrorType {
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
 * Toggl Error class
 *
 * Custom error class for Toggl Integration operations.
 */
export class TogglError extends Error {
  public readonly code: string | number
  public readonly type: TogglErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TogglErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TogglError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TogglError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TogglError instance
   */
  static fromError(error: any): TogglError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TogglErrorType; retryable: boolean }> = {
      '401': { type: TogglErrorType.Authentication, retryable: false },
      '429': { type: TogglErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TogglError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TogglErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TogglErrorType.Authentication
    } else if (statusCode === 403) {
      type = TogglErrorType.Authorization
    } else if (statusCode === 404) {
      type = TogglErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TogglErrorType.Validation
    } else if (statusCode === 429) {
      type = TogglErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TogglErrorType.Server
      retryable = true
    }

    return new TogglError(message, code, type, {
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
    return this.type === TogglErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TogglErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TogglErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TogglErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TogglErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TogglErrorType.Server
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
