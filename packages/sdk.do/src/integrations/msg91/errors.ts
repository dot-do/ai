/**
 * Msg91 Errors
 *
 * Auto-generated error handling for Msg91 Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/msg91
 */

/**
 * Error type enum
 */
export enum Msg91ErrorType {
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
 * Msg91 Error class
 *
 * Custom error class for Msg91 Integration operations.
 */
export class Msg91Error extends Error {
  public readonly code: string | number
  public readonly type: Msg91ErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Msg91ErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Msg91Error'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Msg91Error)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Msg91Error instance
   */
  static fromError(error: any): Msg91Error {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Msg91ErrorType; retryable: boolean }> = {
      '401': { type: Msg91ErrorType.Authentication, retryable: false },
      '429': { type: Msg91ErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Msg91Error(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Msg91ErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Msg91ErrorType.Authentication
    } else if (statusCode === 403) {
      type = Msg91ErrorType.Authorization
    } else if (statusCode === 404) {
      type = Msg91ErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Msg91ErrorType.Validation
    } else if (statusCode === 429) {
      type = Msg91ErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Msg91ErrorType.Server
      retryable = true
    }

    return new Msg91Error(message, code, type, {
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
    return this.type === Msg91ErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Msg91ErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Msg91ErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Msg91ErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Msg91ErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Msg91ErrorType.Server
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
