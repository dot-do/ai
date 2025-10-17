/**
 * Habitica Errors
 *
 * Auto-generated error handling for Habitica Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/habitica
 */

/**
 * Error type enum
 */
export enum HabiticaErrorType {
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
 * Habitica Error class
 *
 * Custom error class for Habitica Integration operations.
 */
export class HabiticaError extends Error {
  public readonly code: string | number
  public readonly type: HabiticaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HabiticaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HabiticaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HabiticaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HabiticaError instance
   */
  static fromError(error: any): HabiticaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HabiticaErrorType; retryable: boolean }> = {
      '401': { type: HabiticaErrorType.Authentication, retryable: false },
      '429': { type: HabiticaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HabiticaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HabiticaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HabiticaErrorType.Authentication
    } else if (statusCode === 403) {
      type = HabiticaErrorType.Authorization
    } else if (statusCode === 404) {
      type = HabiticaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HabiticaErrorType.Validation
    } else if (statusCode === 429) {
      type = HabiticaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HabiticaErrorType.Server
      retryable = true
    }

    return new HabiticaError(message, code, type, {
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
    return this.type === HabiticaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HabiticaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HabiticaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HabiticaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HabiticaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HabiticaErrorType.Server
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
