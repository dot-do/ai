/**
 * Clockify Errors
 *
 * Auto-generated error handling for Clockify Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/clockify
 */

/**
 * Error type enum
 */
export enum ClockifyErrorType {
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
 * Clockify Error class
 *
 * Custom error class for Clockify Integration operations.
 */
export class ClockifyError extends Error {
  public readonly code: string | number
  public readonly type: ClockifyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ClockifyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ClockifyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClockifyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ClockifyError instance
   */
  static fromError(error: any): ClockifyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ClockifyErrorType; retryable: boolean }> = {
      '401': { type: ClockifyErrorType.Authentication, retryable: false },
      '429': { type: ClockifyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ClockifyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ClockifyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ClockifyErrorType.Authentication
    } else if (statusCode === 403) {
      type = ClockifyErrorType.Authorization
    } else if (statusCode === 404) {
      type = ClockifyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ClockifyErrorType.Validation
    } else if (statusCode === 429) {
      type = ClockifyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ClockifyErrorType.Server
      retryable = true
    }

    return new ClockifyError(message, code, type, {
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
    return this.type === ClockifyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ClockifyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ClockifyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ClockifyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ClockifyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ClockifyErrorType.Server
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
