/**
 * Geocodio Errors
 *
 * Auto-generated error handling for Geocodio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/geocodio
 */

/**
 * Error type enum
 */
export enum GeocodioErrorType {
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
 * Geocodio Error class
 *
 * Custom error class for Geocodio Integration operations.
 */
export class GeocodioError extends Error {
  public readonly code: string | number
  public readonly type: GeocodioErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GeocodioErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GeocodioError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GeocodioError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GeocodioError instance
   */
  static fromError(error: any): GeocodioError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GeocodioErrorType; retryable: boolean }> = {
      '401': { type: GeocodioErrorType.Authentication, retryable: false },
      '429': { type: GeocodioErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GeocodioError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GeocodioErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GeocodioErrorType.Authentication
    } else if (statusCode === 403) {
      type = GeocodioErrorType.Authorization
    } else if (statusCode === 404) {
      type = GeocodioErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GeocodioErrorType.Validation
    } else if (statusCode === 429) {
      type = GeocodioErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GeocodioErrorType.Server
      retryable = true
    }

    return new GeocodioError(message, code, type, {
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
    return this.type === GeocodioErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GeocodioErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GeocodioErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GeocodioErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GeocodioErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GeocodioErrorType.Server
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
