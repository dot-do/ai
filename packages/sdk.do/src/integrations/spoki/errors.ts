/**
 * Spoki Errors
 *
 * Auto-generated error handling for Spoki Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/spoki
 */

/**
 * Error type enum
 */
export enum SpokiErrorType {
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
 * Spoki Error class
 *
 * Custom error class for Spoki Integration operations.
 */
export class SpokiError extends Error {
  public readonly code: string | number
  public readonly type: SpokiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SpokiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SpokiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SpokiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SpokiError instance
   */
  static fromError(error: any): SpokiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SpokiErrorType; retryable: boolean }> = {
      '401': { type: SpokiErrorType.Authentication, retryable: false },
      '429': { type: SpokiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SpokiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SpokiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SpokiErrorType.Authentication
    } else if (statusCode === 403) {
      type = SpokiErrorType.Authorization
    } else if (statusCode === 404) {
      type = SpokiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SpokiErrorType.Validation
    } else if (statusCode === 429) {
      type = SpokiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SpokiErrorType.Server
      retryable = true
    }

    return new SpokiError(message, code, type, {
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
    return this.type === SpokiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SpokiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SpokiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SpokiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SpokiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SpokiErrorType.Server
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
