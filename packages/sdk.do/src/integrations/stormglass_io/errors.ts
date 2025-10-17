/**
 * Stormglass io Errors
 *
 * Auto-generated error handling for Stormglass io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/stormglass_io
 */

/**
 * Error type enum
 */
export enum StormglassIoErrorType {
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
 * Stormglass io Error class
 *
 * Custom error class for Stormglass io Integration operations.
 */
export class StormglassIoError extends Error {
  public readonly code: string | number
  public readonly type: StormglassIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: StormglassIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'StormglassIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StormglassIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns StormglassIoError instance
   */
  static fromError(error: any): StormglassIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: StormglassIoErrorType; retryable: boolean }> = {
      '401': { type: StormglassIoErrorType.Authentication, retryable: false },
      '429': { type: StormglassIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new StormglassIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = StormglassIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = StormglassIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = StormglassIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = StormglassIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = StormglassIoErrorType.Validation
    } else if (statusCode === 429) {
      type = StormglassIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = StormglassIoErrorType.Server
      retryable = true
    }

    return new StormglassIoError(message, code, type, {
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
    return this.type === StormglassIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === StormglassIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === StormglassIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === StormglassIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === StormglassIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === StormglassIoErrorType.Server
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
