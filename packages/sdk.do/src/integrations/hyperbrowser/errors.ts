/**
 * Hyperbrowser Errors
 *
 * Auto-generated error handling for Hyperbrowser Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hyperbrowser
 */

/**
 * Error type enum
 */
export enum HyperbrowserErrorType {
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
 * Hyperbrowser Error class
 *
 * Custom error class for Hyperbrowser Integration operations.
 */
export class HyperbrowserError extends Error {
  public readonly code: string | number
  public readonly type: HyperbrowserErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HyperbrowserErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HyperbrowserError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HyperbrowserError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HyperbrowserError instance
   */
  static fromError(error: any): HyperbrowserError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HyperbrowserErrorType; retryable: boolean }> = {
      '401': { type: HyperbrowserErrorType.Authentication, retryable: false },
      '429': { type: HyperbrowserErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HyperbrowserError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HyperbrowserErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HyperbrowserErrorType.Authentication
    } else if (statusCode === 403) {
      type = HyperbrowserErrorType.Authorization
    } else if (statusCode === 404) {
      type = HyperbrowserErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HyperbrowserErrorType.Validation
    } else if (statusCode === 429) {
      type = HyperbrowserErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HyperbrowserErrorType.Server
      retryable = true
    }

    return new HyperbrowserError(message, code, type, {
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
    return this.type === HyperbrowserErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HyperbrowserErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HyperbrowserErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HyperbrowserErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HyperbrowserErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HyperbrowserErrorType.Server
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
