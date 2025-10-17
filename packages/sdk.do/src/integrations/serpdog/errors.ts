/**
 * Serpdog Errors
 *
 * Auto-generated error handling for Serpdog Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/serpdog
 */

/**
 * Error type enum
 */
export enum SerpdogErrorType {
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
 * Serpdog Error class
 *
 * Custom error class for Serpdog Integration operations.
 */
export class SerpdogError extends Error {
  public readonly code: string | number
  public readonly type: SerpdogErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SerpdogErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SerpdogError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SerpdogError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SerpdogError instance
   */
  static fromError(error: any): SerpdogError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SerpdogErrorType; retryable: boolean }> = {
      '401': { type: SerpdogErrorType.Authentication, retryable: false },
      '429': { type: SerpdogErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SerpdogError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SerpdogErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SerpdogErrorType.Authentication
    } else if (statusCode === 403) {
      type = SerpdogErrorType.Authorization
    } else if (statusCode === 404) {
      type = SerpdogErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SerpdogErrorType.Validation
    } else if (statusCode === 429) {
      type = SerpdogErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SerpdogErrorType.Server
      retryable = true
    }

    return new SerpdogError(message, code, type, {
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
    return this.type === SerpdogErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SerpdogErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SerpdogErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SerpdogErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SerpdogErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SerpdogErrorType.Server
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
