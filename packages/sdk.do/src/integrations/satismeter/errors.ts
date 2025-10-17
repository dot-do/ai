/**
 * Satismeter Errors
 *
 * Auto-generated error handling for Satismeter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/satismeter
 */

/**
 * Error type enum
 */
export enum SatismeterErrorType {
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
 * Satismeter Error class
 *
 * Custom error class for Satismeter Integration operations.
 */
export class SatismeterError extends Error {
  public readonly code: string | number
  public readonly type: SatismeterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SatismeterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SatismeterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SatismeterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SatismeterError instance
   */
  static fromError(error: any): SatismeterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SatismeterErrorType; retryable: boolean }> = {
      '401': { type: SatismeterErrorType.Authentication, retryable: false },
      '429': { type: SatismeterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SatismeterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SatismeterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SatismeterErrorType.Authentication
    } else if (statusCode === 403) {
      type = SatismeterErrorType.Authorization
    } else if (statusCode === 404) {
      type = SatismeterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SatismeterErrorType.Validation
    } else if (statusCode === 429) {
      type = SatismeterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SatismeterErrorType.Server
      retryable = true
    }

    return new SatismeterError(message, code, type, {
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
    return this.type === SatismeterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SatismeterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SatismeterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SatismeterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SatismeterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SatismeterErrorType.Server
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
