/**
 * Tomtom Errors
 *
 * Auto-generated error handling for Tomtom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tomtom
 */

/**
 * Error type enum
 */
export enum TomtomErrorType {
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
 * Tomtom Error class
 *
 * Custom error class for Tomtom Integration operations.
 */
export class TomtomError extends Error {
  public readonly code: string | number
  public readonly type: TomtomErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TomtomErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TomtomError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TomtomError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TomtomError instance
   */
  static fromError(error: any): TomtomError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TomtomErrorType; retryable: boolean }> = {
      '401': { type: TomtomErrorType.Authentication, retryable: false },
      '429': { type: TomtomErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TomtomError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TomtomErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TomtomErrorType.Authentication
    } else if (statusCode === 403) {
      type = TomtomErrorType.Authorization
    } else if (statusCode === 404) {
      type = TomtomErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TomtomErrorType.Validation
    } else if (statusCode === 429) {
      type = TomtomErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TomtomErrorType.Server
      retryable = true
    }

    return new TomtomError(message, code, type, {
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
    return this.type === TomtomErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TomtomErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TomtomErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TomtomErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TomtomErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TomtomErrorType.Server
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
