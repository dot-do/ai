/**
 * Moonclerk Errors
 *
 * Auto-generated error handling for Moonclerk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/moonclerk
 */

/**
 * Error type enum
 */
export enum MoonclerkErrorType {
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
 * Moonclerk Error class
 *
 * Custom error class for Moonclerk Integration operations.
 */
export class MoonclerkError extends Error {
  public readonly code: string | number
  public readonly type: MoonclerkErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MoonclerkErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MoonclerkError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MoonclerkError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MoonclerkError instance
   */
  static fromError(error: any): MoonclerkError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MoonclerkErrorType; retryable: boolean }> = {
      '401': { type: MoonclerkErrorType.Authentication, retryable: false },
      '429': { type: MoonclerkErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MoonclerkError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MoonclerkErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MoonclerkErrorType.Authentication
    } else if (statusCode === 403) {
      type = MoonclerkErrorType.Authorization
    } else if (statusCode === 404) {
      type = MoonclerkErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MoonclerkErrorType.Validation
    } else if (statusCode === 429) {
      type = MoonclerkErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MoonclerkErrorType.Server
      retryable = true
    }

    return new MoonclerkError(message, code, type, {
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
    return this.type === MoonclerkErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MoonclerkErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MoonclerkErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MoonclerkErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MoonclerkErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MoonclerkErrorType.Server
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
