/**
 * Close Errors
 *
 * Auto-generated error handling for Close Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/close
 */

/**
 * Error type enum
 */
export enum CloseErrorType {
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
 * Close Error class
 *
 * Custom error class for Close Integration operations.
 */
export class CloseError extends Error {
  public readonly code: string | number
  public readonly type: CloseErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CloseErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CloseError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CloseError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CloseError instance
   */
  static fromError(error: any): CloseError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CloseErrorType; retryable: boolean }> = {
      '401': { type: CloseErrorType.Authentication, retryable: false },
      '429': { type: CloseErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CloseError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CloseErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CloseErrorType.Authentication
    } else if (statusCode === 403) {
      type = CloseErrorType.Authorization
    } else if (statusCode === 404) {
      type = CloseErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CloseErrorType.Validation
    } else if (statusCode === 429) {
      type = CloseErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CloseErrorType.Server
      retryable = true
    }

    return new CloseError(message, code, type, {
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
    return this.type === CloseErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CloseErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CloseErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CloseErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CloseErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CloseErrorType.Server
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
