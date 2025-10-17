/**
 * Snowflake basic Errors
 *
 * Auto-generated error handling for Snowflake basic Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/snowflake_basic
 */

/**
 * Error type enum
 */
export enum SnowflakeBasicErrorType {
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
 * Snowflake basic Error class
 *
 * Custom error class for Snowflake basic Integration operations.
 */
export class SnowflakeBasicError extends Error {
  public readonly code: string | number
  public readonly type: SnowflakeBasicErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SnowflakeBasicErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SnowflakeBasicError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SnowflakeBasicError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SnowflakeBasicError instance
   */
  static fromError(error: any): SnowflakeBasicError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SnowflakeBasicErrorType; retryable: boolean }> = {
      '401': { type: SnowflakeBasicErrorType.Authentication, retryable: false },
      '429': { type: SnowflakeBasicErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SnowflakeBasicError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SnowflakeBasicErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SnowflakeBasicErrorType.Authentication
    } else if (statusCode === 403) {
      type = SnowflakeBasicErrorType.Authorization
    } else if (statusCode === 404) {
      type = SnowflakeBasicErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SnowflakeBasicErrorType.Validation
    } else if (statusCode === 429) {
      type = SnowflakeBasicErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SnowflakeBasicErrorType.Server
      retryable = true
    }

    return new SnowflakeBasicError(message, code, type, {
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
    return this.type === SnowflakeBasicErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SnowflakeBasicErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SnowflakeBasicErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SnowflakeBasicErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SnowflakeBasicErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SnowflakeBasicErrorType.Server
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
