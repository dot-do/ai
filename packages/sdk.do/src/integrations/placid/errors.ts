/**
 * Placid Errors
 *
 * Auto-generated error handling for Placid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/placid
 */

/**
 * Error type enum
 */
export enum PlacidErrorType {
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
 * Placid Error class
 *
 * Custom error class for Placid Integration operations.
 */
export class PlacidError extends Error {
  public readonly code: string | number
  public readonly type: PlacidErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PlacidErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PlacidError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PlacidError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PlacidError instance
   */
  static fromError(error: any): PlacidError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PlacidErrorType; retryable: boolean }> = {
      '401': { type: PlacidErrorType.Authentication, retryable: false },
      '429': { type: PlacidErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PlacidError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PlacidErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PlacidErrorType.Authentication
    } else if (statusCode === 403) {
      type = PlacidErrorType.Authorization
    } else if (statusCode === 404) {
      type = PlacidErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PlacidErrorType.Validation
    } else if (statusCode === 429) {
      type = PlacidErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PlacidErrorType.Server
      retryable = true
    }

    return new PlacidError(message, code, type, {
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
    return this.type === PlacidErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PlacidErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PlacidErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PlacidErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PlacidErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PlacidErrorType.Server
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
