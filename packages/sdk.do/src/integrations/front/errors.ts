/**
 * Front Errors
 *
 * Auto-generated error handling for Front Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/front
 */

/**
 * Error type enum
 */
export enum FrontErrorType {
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
 * Front Error class
 *
 * Custom error class for Front Integration operations.
 */
export class FrontError extends Error {
  public readonly code: string | number
  public readonly type: FrontErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FrontErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FrontError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FrontError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FrontError instance
   */
  static fromError(error: any): FrontError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FrontErrorType; retryable: boolean }> = {
      invalid_token: { type: FrontErrorType.Authentication, retryable: false },
      forbidden: { type: FrontErrorType.Authorization, retryable: false },
      not_found: { type: FrontErrorType.NotFound, retryable: false },
      too_many_requests: { type: FrontErrorType.RateLimit, retryable: true },
      internal_error: { type: FrontErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FrontError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FrontErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FrontErrorType.Authentication
    } else if (statusCode === 403) {
      type = FrontErrorType.Authorization
    } else if (statusCode === 404) {
      type = FrontErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FrontErrorType.Validation
    } else if (statusCode === 429) {
      type = FrontErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FrontErrorType.Server
      retryable = true
    }

    return new FrontError(message, code, type, {
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
    return this.type === FrontErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FrontErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FrontErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FrontErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FrontErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FrontErrorType.Server
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
