/**
 * Mapbox Errors
 *
 * Auto-generated error handling for Mapbox Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mapbox
 */

/**
 * Error type enum
 */
export enum MapboxErrorType {
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
 * Mapbox Error class
 *
 * Custom error class for Mapbox Integration operations.
 */
export class MapboxError extends Error {
  public readonly code: string | number
  public readonly type: MapboxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MapboxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MapboxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MapboxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MapboxError instance
   */
  static fromError(error: any): MapboxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MapboxErrorType; retryable: boolean }> = {
      '401': { type: MapboxErrorType.Authentication, retryable: false },
      '429': { type: MapboxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MapboxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MapboxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MapboxErrorType.Authentication
    } else if (statusCode === 403) {
      type = MapboxErrorType.Authorization
    } else if (statusCode === 404) {
      type = MapboxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MapboxErrorType.Validation
    } else if (statusCode === 429) {
      type = MapboxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MapboxErrorType.Server
      retryable = true
    }

    return new MapboxError(message, code, type, {
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
    return this.type === MapboxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MapboxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MapboxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MapboxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MapboxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MapboxErrorType.Server
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
