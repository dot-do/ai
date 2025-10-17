/**
 * Felt Errors
 *
 * Auto-generated error handling for Felt Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/felt
 */

/**
 * Error type enum
 */
export enum FeltErrorType {
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
 * Felt Error class
 *
 * Custom error class for Felt Integration operations.
 */
export class FeltError extends Error {
  public readonly code: string | number
  public readonly type: FeltErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FeltErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FeltError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FeltError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FeltError instance
   */
  static fromError(error: any): FeltError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FeltErrorType; retryable: boolean }> = {
      '401': { type: FeltErrorType.Authentication, retryable: false },
      '429': { type: FeltErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FeltError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FeltErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FeltErrorType.Authentication
    } else if (statusCode === 403) {
      type = FeltErrorType.Authorization
    } else if (statusCode === 404) {
      type = FeltErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FeltErrorType.Validation
    } else if (statusCode === 429) {
      type = FeltErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FeltErrorType.Server
      retryable = true
    }

    return new FeltError(message, code, type, {
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
    return this.type === FeltErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FeltErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FeltErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FeltErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FeltErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FeltErrorType.Server
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
