/**
 * Google Super Errors
 *
 * Auto-generated error handling for Google Super Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googlesuper
 */

/**
 * Error type enum
 */
export enum GooglesuperErrorType {
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
 * Google Super Error class
 *
 * Custom error class for Google Super Integration operations.
 */
export class GooglesuperError extends Error {
  public readonly code: string | number
  public readonly type: GooglesuperErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GooglesuperErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GooglesuperError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GooglesuperError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GooglesuperError instance
   */
  static fromError(error: any): GooglesuperError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GooglesuperErrorType; retryable: boolean }> = {
      '401': { type: GooglesuperErrorType.Authentication, retryable: false },
      '429': { type: GooglesuperErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GooglesuperError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GooglesuperErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GooglesuperErrorType.Authentication
    } else if (statusCode === 403) {
      type = GooglesuperErrorType.Authorization
    } else if (statusCode === 404) {
      type = GooglesuperErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GooglesuperErrorType.Validation
    } else if (statusCode === 429) {
      type = GooglesuperErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GooglesuperErrorType.Server
      retryable = true
    }

    return new GooglesuperError(message, code, type, {
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
    return this.type === GooglesuperErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GooglesuperErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GooglesuperErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GooglesuperErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GooglesuperErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GooglesuperErrorType.Server
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
