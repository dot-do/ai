/**
 * Sympla Errors
 *
 * Auto-generated error handling for Sympla Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sympla
 */

/**
 * Error type enum
 */
export enum SymplaErrorType {
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
 * Sympla Error class
 *
 * Custom error class for Sympla Integration operations.
 */
export class SymplaError extends Error {
  public readonly code: string | number
  public readonly type: SymplaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SymplaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SymplaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SymplaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SymplaError instance
   */
  static fromError(error: any): SymplaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SymplaErrorType; retryable: boolean }> = {
      '401': { type: SymplaErrorType.Authentication, retryable: false },
      '429': { type: SymplaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SymplaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SymplaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SymplaErrorType.Authentication
    } else if (statusCode === 403) {
      type = SymplaErrorType.Authorization
    } else if (statusCode === 404) {
      type = SymplaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SymplaErrorType.Validation
    } else if (statusCode === 429) {
      type = SymplaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SymplaErrorType.Server
      retryable = true
    }

    return new SymplaError(message, code, type, {
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
    return this.type === SymplaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SymplaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SymplaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SymplaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SymplaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SymplaErrorType.Server
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
