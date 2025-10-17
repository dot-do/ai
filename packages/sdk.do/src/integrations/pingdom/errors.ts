/**
 * Pingdom Errors
 *
 * Auto-generated error handling for Pingdom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pingdom
 */

/**
 * Error type enum
 */
export enum PingdomErrorType {
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
 * Pingdom Error class
 *
 * Custom error class for Pingdom Integration operations.
 */
export class PingdomError extends Error {
  public readonly code: string | number
  public readonly type: PingdomErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PingdomErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PingdomError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PingdomError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PingdomError instance
   */
  static fromError(error: any): PingdomError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PingdomErrorType; retryable: boolean }> = {
      '401': { type: PingdomErrorType.Authentication, retryable: false },
      '429': { type: PingdomErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PingdomError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PingdomErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PingdomErrorType.Authentication
    } else if (statusCode === 403) {
      type = PingdomErrorType.Authorization
    } else if (statusCode === 404) {
      type = PingdomErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PingdomErrorType.Validation
    } else if (statusCode === 429) {
      type = PingdomErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PingdomErrorType.Server
      retryable = true
    }

    return new PingdomError(message, code, type, {
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
    return this.type === PingdomErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PingdomErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PingdomErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PingdomErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PingdomErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PingdomErrorType.Server
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
