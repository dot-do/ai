/**
 * Radar Errors
 *
 * Auto-generated error handling for Radar Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/radar
 */

/**
 * Error type enum
 */
export enum RadarErrorType {
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
 * Radar Error class
 *
 * Custom error class for Radar Integration operations.
 */
export class RadarError extends Error {
  public readonly code: string | number
  public readonly type: RadarErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RadarErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RadarError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RadarError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RadarError instance
   */
  static fromError(error: any): RadarError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RadarErrorType; retryable: boolean }> = {
      '401': { type: RadarErrorType.Authentication, retryable: false },
      '429': { type: RadarErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RadarError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RadarErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RadarErrorType.Authentication
    } else if (statusCode === 403) {
      type = RadarErrorType.Authorization
    } else if (statusCode === 404) {
      type = RadarErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RadarErrorType.Validation
    } else if (statusCode === 429) {
      type = RadarErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RadarErrorType.Server
      retryable = true
    }

    return new RadarError(message, code, type, {
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
    return this.type === RadarErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RadarErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RadarErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RadarErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RadarErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RadarErrorType.Server
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
