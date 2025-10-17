/**
 * Guru Errors
 *
 * Auto-generated error handling for Guru Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/guru
 */

/**
 * Error type enum
 */
export enum GuruErrorType {
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
 * Guru Error class
 *
 * Custom error class for Guru Integration operations.
 */
export class GuruError extends Error {
  public readonly code: string | number
  public readonly type: GuruErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GuruErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GuruError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GuruError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GuruError instance
   */
  static fromError(error: any): GuruError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GuruErrorType; retryable: boolean }> = {
      '401': { type: GuruErrorType.Authentication, retryable: false },
      '429': { type: GuruErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GuruError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GuruErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GuruErrorType.Authentication
    } else if (statusCode === 403) {
      type = GuruErrorType.Authorization
    } else if (statusCode === 404) {
      type = GuruErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GuruErrorType.Validation
    } else if (statusCode === 429) {
      type = GuruErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GuruErrorType.Server
      retryable = true
    }

    return new GuruError(message, code, type, {
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
    return this.type === GuruErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GuruErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GuruErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GuruErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GuruErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GuruErrorType.Server
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
