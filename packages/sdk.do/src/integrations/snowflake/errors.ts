/**
 * Snowflake Errors
 *
 * Auto-generated error handling for Snowflake Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/snowflake
 */

/**
 * Error type enum
 */
export enum SnowflakeErrorType {
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
 * Snowflake Error class
 *
 * Custom error class for Snowflake Integration operations.
 */
export class SnowflakeError extends Error {
  public readonly code: string | number
  public readonly type: SnowflakeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SnowflakeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SnowflakeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SnowflakeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SnowflakeError instance
   */
  static fromError(error: any): SnowflakeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SnowflakeErrorType; retryable: boolean }> = {
      '401': { type: SnowflakeErrorType.Authentication, retryable: false },
      '429': { type: SnowflakeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SnowflakeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SnowflakeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SnowflakeErrorType.Authentication
    } else if (statusCode === 403) {
      type = SnowflakeErrorType.Authorization
    } else if (statusCode === 404) {
      type = SnowflakeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SnowflakeErrorType.Validation
    } else if (statusCode === 429) {
      type = SnowflakeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SnowflakeErrorType.Server
      retryable = true
    }

    return new SnowflakeError(message, code, type, {
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
    return this.type === SnowflakeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SnowflakeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SnowflakeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SnowflakeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SnowflakeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SnowflakeErrorType.Server
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
