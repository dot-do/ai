/**
 * Clickmeeting Errors
 *
 * Auto-generated error handling for Clickmeeting Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/clickmeeting
 */

/**
 * Error type enum
 */
export enum ClickmeetingErrorType {
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
 * Clickmeeting Error class
 *
 * Custom error class for Clickmeeting Integration operations.
 */
export class ClickmeetingError extends Error {
  public readonly code: string | number
  public readonly type: ClickmeetingErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ClickmeetingErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ClickmeetingError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClickmeetingError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ClickmeetingError instance
   */
  static fromError(error: any): ClickmeetingError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ClickmeetingErrorType; retryable: boolean }> = {
      '401': { type: ClickmeetingErrorType.Authentication, retryable: false },
      '429': { type: ClickmeetingErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ClickmeetingError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ClickmeetingErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ClickmeetingErrorType.Authentication
    } else if (statusCode === 403) {
      type = ClickmeetingErrorType.Authorization
    } else if (statusCode === 404) {
      type = ClickmeetingErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ClickmeetingErrorType.Validation
    } else if (statusCode === 429) {
      type = ClickmeetingErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ClickmeetingErrorType.Server
      retryable = true
    }

    return new ClickmeetingError(message, code, type, {
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
    return this.type === ClickmeetingErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ClickmeetingErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ClickmeetingErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ClickmeetingErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ClickmeetingErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ClickmeetingErrorType.Server
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
