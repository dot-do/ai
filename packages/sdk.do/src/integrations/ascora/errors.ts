/**
 * Ascora Errors
 *
 * Auto-generated error handling for Ascora Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ascora
 */

/**
 * Error type enum
 */
export enum AscoraErrorType {
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
 * Ascora Error class
 *
 * Custom error class for Ascora Integration operations.
 */
export class AscoraError extends Error {
  public readonly code: string | number
  public readonly type: AscoraErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AscoraErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AscoraError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AscoraError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AscoraError instance
   */
  static fromError(error: any): AscoraError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AscoraErrorType; retryable: boolean }> = {
      '401': { type: AscoraErrorType.Authentication, retryable: false },
      '429': { type: AscoraErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AscoraError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AscoraErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AscoraErrorType.Authentication
    } else if (statusCode === 403) {
      type = AscoraErrorType.Authorization
    } else if (statusCode === 404) {
      type = AscoraErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AscoraErrorType.Validation
    } else if (statusCode === 429) {
      type = AscoraErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AscoraErrorType.Server
      retryable = true
    }

    return new AscoraError(message, code, type, {
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
    return this.type === AscoraErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AscoraErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AscoraErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AscoraErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AscoraErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AscoraErrorType.Server
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
