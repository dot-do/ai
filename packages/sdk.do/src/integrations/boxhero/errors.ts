/**
 * Boxhero Errors
 *
 * Auto-generated error handling for Boxhero Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/boxhero
 */

/**
 * Error type enum
 */
export enum BoxheroErrorType {
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
 * Boxhero Error class
 *
 * Custom error class for Boxhero Integration operations.
 */
export class BoxheroError extends Error {
  public readonly code: string | number
  public readonly type: BoxheroErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BoxheroErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BoxheroError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BoxheroError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BoxheroError instance
   */
  static fromError(error: any): BoxheroError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BoxheroErrorType; retryable: boolean }> = {
      '401': { type: BoxheroErrorType.Authentication, retryable: false },
      '429': { type: BoxheroErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BoxheroError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BoxheroErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BoxheroErrorType.Authentication
    } else if (statusCode === 403) {
      type = BoxheroErrorType.Authorization
    } else if (statusCode === 404) {
      type = BoxheroErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BoxheroErrorType.Validation
    } else if (statusCode === 429) {
      type = BoxheroErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BoxheroErrorType.Server
      retryable = true
    }

    return new BoxheroError(message, code, type, {
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
    return this.type === BoxheroErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BoxheroErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BoxheroErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BoxheroErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BoxheroErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BoxheroErrorType.Server
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
