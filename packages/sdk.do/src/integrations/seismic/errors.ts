/**
 * Seismic Errors
 *
 * Auto-generated error handling for Seismic Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/seismic
 */

/**
 * Error type enum
 */
export enum SeismicErrorType {
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
 * Seismic Error class
 *
 * Custom error class for Seismic Integration operations.
 */
export class SeismicError extends Error {
  public readonly code: string | number
  public readonly type: SeismicErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SeismicErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SeismicError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SeismicError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SeismicError instance
   */
  static fromError(error: any): SeismicError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SeismicErrorType; retryable: boolean }> = {
      '401': { type: SeismicErrorType.Authentication, retryable: false },
      '429': { type: SeismicErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SeismicError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SeismicErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SeismicErrorType.Authentication
    } else if (statusCode === 403) {
      type = SeismicErrorType.Authorization
    } else if (statusCode === 404) {
      type = SeismicErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SeismicErrorType.Validation
    } else if (statusCode === 429) {
      type = SeismicErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SeismicErrorType.Server
      retryable = true
    }

    return new SeismicError(message, code, type, {
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
    return this.type === SeismicErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SeismicErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SeismicErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SeismicErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SeismicErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SeismicErrorType.Server
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
