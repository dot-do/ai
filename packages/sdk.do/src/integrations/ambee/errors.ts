/**
 * Ambee Errors
 *
 * Auto-generated error handling for Ambee Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ambee
 */

/**
 * Error type enum
 */
export enum AmbeeErrorType {
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
 * Ambee Error class
 *
 * Custom error class for Ambee Integration operations.
 */
export class AmbeeError extends Error {
  public readonly code: string | number
  public readonly type: AmbeeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AmbeeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AmbeeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AmbeeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AmbeeError instance
   */
  static fromError(error: any): AmbeeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AmbeeErrorType; retryable: boolean }> = {
      '401': { type: AmbeeErrorType.Authentication, retryable: false },
      '429': { type: AmbeeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AmbeeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AmbeeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AmbeeErrorType.Authentication
    } else if (statusCode === 403) {
      type = AmbeeErrorType.Authorization
    } else if (statusCode === 404) {
      type = AmbeeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AmbeeErrorType.Validation
    } else if (statusCode === 429) {
      type = AmbeeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AmbeeErrorType.Server
      retryable = true
    }

    return new AmbeeError(message, code, type, {
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
    return this.type === AmbeeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AmbeeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AmbeeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AmbeeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AmbeeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AmbeeErrorType.Server
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
