/**
 * Beeminder Errors
 *
 * Auto-generated error handling for Beeminder Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/beeminder
 */

/**
 * Error type enum
 */
export enum BeeminderErrorType {
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
 * Beeminder Error class
 *
 * Custom error class for Beeminder Integration operations.
 */
export class BeeminderError extends Error {
  public readonly code: string | number
  public readonly type: BeeminderErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BeeminderErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BeeminderError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BeeminderError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BeeminderError instance
   */
  static fromError(error: any): BeeminderError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BeeminderErrorType; retryable: boolean }> = {
      '401': { type: BeeminderErrorType.Authentication, retryable: false },
      '429': { type: BeeminderErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BeeminderError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BeeminderErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BeeminderErrorType.Authentication
    } else if (statusCode === 403) {
      type = BeeminderErrorType.Authorization
    } else if (statusCode === 404) {
      type = BeeminderErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BeeminderErrorType.Validation
    } else if (statusCode === 429) {
      type = BeeminderErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BeeminderErrorType.Server
      retryable = true
    }

    return new BeeminderError(message, code, type, {
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
    return this.type === BeeminderErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BeeminderErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BeeminderErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BeeminderErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BeeminderErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BeeminderErrorType.Server
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
