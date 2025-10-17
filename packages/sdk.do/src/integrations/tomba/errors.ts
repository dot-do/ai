/**
 * Tomba Errors
 *
 * Auto-generated error handling for Tomba Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tomba
 */

/**
 * Error type enum
 */
export enum TombaErrorType {
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
 * Tomba Error class
 *
 * Custom error class for Tomba Integration operations.
 */
export class TombaError extends Error {
  public readonly code: string | number
  public readonly type: TombaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TombaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TombaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TombaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TombaError instance
   */
  static fromError(error: any): TombaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TombaErrorType; retryable: boolean }> = {
      '401': { type: TombaErrorType.Authentication, retryable: false },
      '429': { type: TombaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TombaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TombaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TombaErrorType.Authentication
    } else if (statusCode === 403) {
      type = TombaErrorType.Authorization
    } else if (statusCode === 404) {
      type = TombaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TombaErrorType.Validation
    } else if (statusCode === 429) {
      type = TombaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TombaErrorType.Server
      retryable = true
    }

    return new TombaError(message, code, type, {
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
    return this.type === TombaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TombaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TombaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TombaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TombaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TombaErrorType.Server
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
