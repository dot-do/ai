/**
 * Polygon io Errors
 *
 * Auto-generated error handling for Polygon io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/polygon_io
 */

/**
 * Error type enum
 */
export enum PolygonIoErrorType {
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
 * Polygon io Error class
 *
 * Custom error class for Polygon io Integration operations.
 */
export class PolygonIoError extends Error {
  public readonly code: string | number
  public readonly type: PolygonIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PolygonIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PolygonIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PolygonIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PolygonIoError instance
   */
  static fromError(error: any): PolygonIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PolygonIoErrorType; retryable: boolean }> = {
      '401': { type: PolygonIoErrorType.Authentication, retryable: false },
      '429': { type: PolygonIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PolygonIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PolygonIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PolygonIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = PolygonIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = PolygonIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PolygonIoErrorType.Validation
    } else if (statusCode === 429) {
      type = PolygonIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PolygonIoErrorType.Server
      retryable = true
    }

    return new PolygonIoError(message, code, type, {
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
    return this.type === PolygonIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PolygonIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PolygonIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PolygonIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PolygonIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PolygonIoErrorType.Server
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
