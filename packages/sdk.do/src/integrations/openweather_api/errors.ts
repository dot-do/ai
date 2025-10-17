/**
 * Openweather api Errors
 *
 * Auto-generated error handling for Openweather api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/openweather_api
 */

/**
 * Error type enum
 */
export enum OpenweatherApiErrorType {
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
 * Openweather api Error class
 *
 * Custom error class for Openweather api Integration operations.
 */
export class OpenweatherApiError extends Error {
  public readonly code: string | number
  public readonly type: OpenweatherApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OpenweatherApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OpenweatherApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpenweatherApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OpenweatherApiError instance
   */
  static fromError(error: any): OpenweatherApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OpenweatherApiErrorType; retryable: boolean }> = {
      '401': { type: OpenweatherApiErrorType.Authentication, retryable: false },
      '429': { type: OpenweatherApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OpenweatherApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OpenweatherApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OpenweatherApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = OpenweatherApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = OpenweatherApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OpenweatherApiErrorType.Validation
    } else if (statusCode === 429) {
      type = OpenweatherApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OpenweatherApiErrorType.Server
      retryable = true
    }

    return new OpenweatherApiError(message, code, type, {
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
    return this.type === OpenweatherApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OpenweatherApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OpenweatherApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OpenweatherApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OpenweatherApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OpenweatherApiErrorType.Server
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
