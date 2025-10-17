/**
 * Datarobot Errors
 *
 * Auto-generated error handling for Datarobot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/datarobot
 */

/**
 * Error type enum
 */
export enum DatarobotErrorType {
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
 * Datarobot Error class
 *
 * Custom error class for Datarobot Integration operations.
 */
export class DatarobotError extends Error {
  public readonly code: string | number
  public readonly type: DatarobotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DatarobotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DatarobotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatarobotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DatarobotError instance
   */
  static fromError(error: any): DatarobotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DatarobotErrorType; retryable: boolean }> = {
      '401': { type: DatarobotErrorType.Authentication, retryable: false },
      '429': { type: DatarobotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DatarobotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DatarobotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DatarobotErrorType.Authentication
    } else if (statusCode === 403) {
      type = DatarobotErrorType.Authorization
    } else if (statusCode === 404) {
      type = DatarobotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DatarobotErrorType.Validation
    } else if (statusCode === 429) {
      type = DatarobotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DatarobotErrorType.Server
      retryable = true
    }

    return new DatarobotError(message, code, type, {
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
    return this.type === DatarobotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DatarobotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DatarobotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DatarobotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DatarobotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DatarobotErrorType.Server
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
