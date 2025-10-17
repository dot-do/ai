/**
 * Bouncer Errors
 *
 * Auto-generated error handling for Bouncer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bouncer
 */

/**
 * Error type enum
 */
export enum BouncerErrorType {
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
 * Bouncer Error class
 *
 * Custom error class for Bouncer Integration operations.
 */
export class BouncerError extends Error {
  public readonly code: string | number
  public readonly type: BouncerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BouncerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BouncerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BouncerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BouncerError instance
   */
  static fromError(error: any): BouncerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BouncerErrorType; retryable: boolean }> = {
      '401': { type: BouncerErrorType.Authentication, retryable: false },
      '429': { type: BouncerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BouncerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BouncerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BouncerErrorType.Authentication
    } else if (statusCode === 403) {
      type = BouncerErrorType.Authorization
    } else if (statusCode === 404) {
      type = BouncerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BouncerErrorType.Validation
    } else if (statusCode === 429) {
      type = BouncerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BouncerErrorType.Server
      retryable = true
    }

    return new BouncerError(message, code, type, {
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
    return this.type === BouncerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BouncerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BouncerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BouncerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BouncerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BouncerErrorType.Server
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
