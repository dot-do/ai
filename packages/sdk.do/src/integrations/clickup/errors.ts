/**
 * Clickup Errors
 *
 * Auto-generated error handling for Clickup Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/clickup
 */

/**
 * Error type enum
 */
export enum ClickupErrorType {
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
 * Clickup Error class
 *
 * Custom error class for Clickup Integration operations.
 */
export class ClickupError extends Error {
  public readonly code: string | number
  public readonly type: ClickupErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ClickupErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ClickupError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClickupError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ClickupError instance
   */
  static fromError(error: any): ClickupError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ClickupErrorType; retryable: boolean }> = {
      '401': { type: ClickupErrorType.Authentication, retryable: false },
      '429': { type: ClickupErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ClickupError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ClickupErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ClickupErrorType.Authentication
    } else if (statusCode === 403) {
      type = ClickupErrorType.Authorization
    } else if (statusCode === 404) {
      type = ClickupErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ClickupErrorType.Validation
    } else if (statusCode === 429) {
      type = ClickupErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ClickupErrorType.Server
      retryable = true
    }

    return new ClickupError(message, code, type, {
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
    return this.type === ClickupErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ClickupErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ClickupErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ClickupErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ClickupErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ClickupErrorType.Server
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
