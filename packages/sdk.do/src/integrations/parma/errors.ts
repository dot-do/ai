/**
 * Parma Errors
 *
 * Auto-generated error handling for Parma Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/parma
 */

/**
 * Error type enum
 */
export enum ParmaErrorType {
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
 * Parma Error class
 *
 * Custom error class for Parma Integration operations.
 */
export class ParmaError extends Error {
  public readonly code: string | number
  public readonly type: ParmaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ParmaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ParmaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParmaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ParmaError instance
   */
  static fromError(error: any): ParmaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ParmaErrorType; retryable: boolean }> = {
      '401': { type: ParmaErrorType.Authentication, retryable: false },
      '429': { type: ParmaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ParmaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ParmaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ParmaErrorType.Authentication
    } else if (statusCode === 403) {
      type = ParmaErrorType.Authorization
    } else if (statusCode === 404) {
      type = ParmaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ParmaErrorType.Validation
    } else if (statusCode === 429) {
      type = ParmaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ParmaErrorType.Server
      retryable = true
    }

    return new ParmaError(message, code, type, {
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
    return this.type === ParmaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ParmaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ParmaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ParmaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ParmaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ParmaErrorType.Server
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
