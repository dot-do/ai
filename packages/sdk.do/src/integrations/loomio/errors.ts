/**
 * Loomio Errors
 *
 * Auto-generated error handling for Loomio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/loomio
 */

/**
 * Error type enum
 */
export enum LoomioErrorType {
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
 * Loomio Error class
 *
 * Custom error class for Loomio Integration operations.
 */
export class LoomioError extends Error {
  public readonly code: string | number
  public readonly type: LoomioErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LoomioErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LoomioError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoomioError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LoomioError instance
   */
  static fromError(error: any): LoomioError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LoomioErrorType; retryable: boolean }> = {
      '401': { type: LoomioErrorType.Authentication, retryable: false },
      '429': { type: LoomioErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LoomioError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LoomioErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LoomioErrorType.Authentication
    } else if (statusCode === 403) {
      type = LoomioErrorType.Authorization
    } else if (statusCode === 404) {
      type = LoomioErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LoomioErrorType.Validation
    } else if (statusCode === 429) {
      type = LoomioErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LoomioErrorType.Server
      retryable = true
    }

    return new LoomioError(message, code, type, {
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
    return this.type === LoomioErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LoomioErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LoomioErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LoomioErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LoomioErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LoomioErrorType.Server
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
