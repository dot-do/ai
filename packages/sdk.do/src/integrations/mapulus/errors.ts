/**
 * Mapulus Errors
 *
 * Auto-generated error handling for Mapulus Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mapulus
 */

/**
 * Error type enum
 */
export enum MapulusErrorType {
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
 * Mapulus Error class
 *
 * Custom error class for Mapulus Integration operations.
 */
export class MapulusError extends Error {
  public readonly code: string | number
  public readonly type: MapulusErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MapulusErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MapulusError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MapulusError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MapulusError instance
   */
  static fromError(error: any): MapulusError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MapulusErrorType; retryable: boolean }> = {
      '401': { type: MapulusErrorType.Authentication, retryable: false },
      '429': { type: MapulusErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MapulusError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MapulusErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MapulusErrorType.Authentication
    } else if (statusCode === 403) {
      type = MapulusErrorType.Authorization
    } else if (statusCode === 404) {
      type = MapulusErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MapulusErrorType.Validation
    } else if (statusCode === 429) {
      type = MapulusErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MapulusErrorType.Server
      retryable = true
    }

    return new MapulusError(message, code, type, {
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
    return this.type === MapulusErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MapulusErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MapulusErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MapulusErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MapulusErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MapulusErrorType.Server
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
