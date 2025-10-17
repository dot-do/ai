/**
 * Dpd2 Errors
 *
 * Auto-generated error handling for Dpd2 Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dpd2
 */

/**
 * Error type enum
 */
export enum Dpd2ErrorType {
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
 * Dpd2 Error class
 *
 * Custom error class for Dpd2 Integration operations.
 */
export class Dpd2Error extends Error {
  public readonly code: string | number
  public readonly type: Dpd2ErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Dpd2ErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Dpd2Error'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Dpd2Error)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Dpd2Error instance
   */
  static fromError(error: any): Dpd2Error {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Dpd2ErrorType; retryable: boolean }> = {
      '401': { type: Dpd2ErrorType.Authentication, retryable: false },
      '429': { type: Dpd2ErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Dpd2Error(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Dpd2ErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Dpd2ErrorType.Authentication
    } else if (statusCode === 403) {
      type = Dpd2ErrorType.Authorization
    } else if (statusCode === 404) {
      type = Dpd2ErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Dpd2ErrorType.Validation
    } else if (statusCode === 429) {
      type = Dpd2ErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Dpd2ErrorType.Server
      retryable = true
    }

    return new Dpd2Error(message, code, type, {
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
    return this.type === Dpd2ErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Dpd2ErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Dpd2ErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Dpd2ErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Dpd2ErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Dpd2ErrorType.Server
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
