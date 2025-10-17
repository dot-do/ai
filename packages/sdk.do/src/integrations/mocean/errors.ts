/**
 * Mocean Errors
 *
 * Auto-generated error handling for Mocean Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mocean
 */

/**
 * Error type enum
 */
export enum MoceanErrorType {
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
 * Mocean Error class
 *
 * Custom error class for Mocean Integration operations.
 */
export class MoceanError extends Error {
  public readonly code: string | number
  public readonly type: MoceanErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MoceanErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MoceanError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MoceanError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MoceanError instance
   */
  static fromError(error: any): MoceanError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MoceanErrorType; retryable: boolean }> = {
      '401': { type: MoceanErrorType.Authentication, retryable: false },
      '429': { type: MoceanErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MoceanError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MoceanErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MoceanErrorType.Authentication
    } else if (statusCode === 403) {
      type = MoceanErrorType.Authorization
    } else if (statusCode === 404) {
      type = MoceanErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MoceanErrorType.Validation
    } else if (statusCode === 429) {
      type = MoceanErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MoceanErrorType.Server
      retryable = true
    }

    return new MoceanError(message, code, type, {
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
    return this.type === MoceanErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MoceanErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MoceanErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MoceanErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MoceanErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MoceanErrorType.Server
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
