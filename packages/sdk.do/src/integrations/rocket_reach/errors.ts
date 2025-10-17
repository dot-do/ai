/**
 * Rocket reach Errors
 *
 * Auto-generated error handling for Rocket reach Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rocket_reach
 */

/**
 * Error type enum
 */
export enum RocketReachErrorType {
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
 * Rocket reach Error class
 *
 * Custom error class for Rocket reach Integration operations.
 */
export class RocketReachError extends Error {
  public readonly code: string | number
  public readonly type: RocketReachErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RocketReachErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RocketReachError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RocketReachError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RocketReachError instance
   */
  static fromError(error: any): RocketReachError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RocketReachErrorType; retryable: boolean }> = {
      '401': { type: RocketReachErrorType.Authentication, retryable: false },
      '429': { type: RocketReachErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RocketReachError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RocketReachErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RocketReachErrorType.Authentication
    } else if (statusCode === 403) {
      type = RocketReachErrorType.Authorization
    } else if (statusCode === 404) {
      type = RocketReachErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RocketReachErrorType.Validation
    } else if (statusCode === 429) {
      type = RocketReachErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RocketReachErrorType.Server
      retryable = true
    }

    return new RocketReachError(message, code, type, {
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
    return this.type === RocketReachErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RocketReachErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RocketReachErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RocketReachErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RocketReachErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RocketReachErrorType.Server
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
