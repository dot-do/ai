/**
 * Placekey Errors
 *
 * Auto-generated error handling for Placekey Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/placekey
 */

/**
 * Error type enum
 */
export enum PlacekeyErrorType {
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
 * Placekey Error class
 *
 * Custom error class for Placekey Integration operations.
 */
export class PlacekeyError extends Error {
  public readonly code: string | number
  public readonly type: PlacekeyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PlacekeyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PlacekeyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PlacekeyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PlacekeyError instance
   */
  static fromError(error: any): PlacekeyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PlacekeyErrorType; retryable: boolean }> = {
      '401': { type: PlacekeyErrorType.Authentication, retryable: false },
      '429': { type: PlacekeyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PlacekeyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PlacekeyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PlacekeyErrorType.Authentication
    } else if (statusCode === 403) {
      type = PlacekeyErrorType.Authorization
    } else if (statusCode === 404) {
      type = PlacekeyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PlacekeyErrorType.Validation
    } else if (statusCode === 429) {
      type = PlacekeyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PlacekeyErrorType.Server
      retryable = true
    }

    return new PlacekeyError(message, code, type, {
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
    return this.type === PlacekeyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PlacekeyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PlacekeyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PlacekeyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PlacekeyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PlacekeyErrorType.Server
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
