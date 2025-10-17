/**
 * Uptimerobot Errors
 *
 * Auto-generated error handling for Uptimerobot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/uptimerobot
 */

/**
 * Error type enum
 */
export enum UptimerobotErrorType {
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
 * Uptimerobot Error class
 *
 * Custom error class for Uptimerobot Integration operations.
 */
export class UptimerobotError extends Error {
  public readonly code: string | number
  public readonly type: UptimerobotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: UptimerobotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'UptimerobotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UptimerobotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns UptimerobotError instance
   */
  static fromError(error: any): UptimerobotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: UptimerobotErrorType; retryable: boolean }> = {
      '401': { type: UptimerobotErrorType.Authentication, retryable: false },
      '429': { type: UptimerobotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new UptimerobotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = UptimerobotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = UptimerobotErrorType.Authentication
    } else if (statusCode === 403) {
      type = UptimerobotErrorType.Authorization
    } else if (statusCode === 404) {
      type = UptimerobotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = UptimerobotErrorType.Validation
    } else if (statusCode === 429) {
      type = UptimerobotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = UptimerobotErrorType.Server
      retryable = true
    }

    return new UptimerobotError(message, code, type, {
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
    return this.type === UptimerobotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === UptimerobotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === UptimerobotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === UptimerobotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === UptimerobotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === UptimerobotErrorType.Server
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
