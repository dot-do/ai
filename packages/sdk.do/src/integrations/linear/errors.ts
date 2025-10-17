/**
 * Linear Errors
 *
 * Auto-generated error handling for Linear Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/linear
 */

/**
 * Error type enum
 */
export enum LinearErrorType {
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
 * Linear Error class
 *
 * Custom error class for Linear Integration operations.
 */
export class LinearError extends Error {
  public readonly code: string | number
  public readonly type: LinearErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LinearErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LinearError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LinearError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LinearError instance
   */
  static fromError(error: any): LinearError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LinearErrorType; retryable: boolean }> = {
      AUTHENTICATION_FAILED: { type: LinearErrorType.Authentication, retryable: false },
      FORBIDDEN: { type: LinearErrorType.Authorization, retryable: false },
      RESOURCE_NOT_FOUND: { type: LinearErrorType.NotFound, retryable: false },
      VALIDATION_ERROR: { type: LinearErrorType.Validation, retryable: false },
      BAD_USER_INPUT: { type: LinearErrorType.Validation, retryable: false },
      GRAPHQL_VALIDATION_FAILED: { type: LinearErrorType.Validation, retryable: false },
      RATE_LIMIT_EXCEEDED: { type: LinearErrorType.RateLimit, retryable: true },
      SERVER_ERROR: { type: LinearErrorType.Server, retryable: true },
      CONNECTION_ERROR: { type: LinearErrorType.Network, retryable: true },
      UNKNOWN_ERROR: { type: LinearErrorType.Unknown, retryable: false },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LinearError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LinearErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LinearErrorType.Authentication
    } else if (statusCode === 403) {
      type = LinearErrorType.Authorization
    } else if (statusCode === 404) {
      type = LinearErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LinearErrorType.Validation
    } else if (statusCode === 429) {
      type = LinearErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LinearErrorType.Server
      retryable = true
    }

    return new LinearError(message, code, type, {
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
    return this.type === LinearErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LinearErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LinearErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LinearErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LinearErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LinearErrorType.Server
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
