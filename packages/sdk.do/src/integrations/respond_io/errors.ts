/**
 * Respond io Errors
 *
 * Auto-generated error handling for Respond io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/respond_io
 */

/**
 * Error type enum
 */
export enum RespondIoErrorType {
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
 * Respond io Error class
 *
 * Custom error class for Respond io Integration operations.
 */
export class RespondIoError extends Error {
  public readonly code: string | number
  public readonly type: RespondIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RespondIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RespondIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RespondIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RespondIoError instance
   */
  static fromError(error: any): RespondIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RespondIoErrorType; retryable: boolean }> = {
      '401': { type: RespondIoErrorType.Authentication, retryable: false },
      '429': { type: RespondIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RespondIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RespondIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RespondIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = RespondIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = RespondIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RespondIoErrorType.Validation
    } else if (statusCode === 429) {
      type = RespondIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RespondIoErrorType.Server
      retryable = true
    }

    return new RespondIoError(message, code, type, {
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
    return this.type === RespondIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RespondIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RespondIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RespondIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RespondIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RespondIoErrorType.Server
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
