/**
 * Rootly Errors
 *
 * Auto-generated error handling for Rootly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rootly
 */

/**
 * Error type enum
 */
export enum RootlyErrorType {
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
 * Rootly Error class
 *
 * Custom error class for Rootly Integration operations.
 */
export class RootlyError extends Error {
  public readonly code: string | number
  public readonly type: RootlyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RootlyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RootlyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RootlyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RootlyError instance
   */
  static fromError(error: any): RootlyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RootlyErrorType; retryable: boolean }> = {
      '401': { type: RootlyErrorType.Authentication, retryable: false },
      '429': { type: RootlyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RootlyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RootlyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RootlyErrorType.Authentication
    } else if (statusCode === 403) {
      type = RootlyErrorType.Authorization
    } else if (statusCode === 404) {
      type = RootlyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RootlyErrorType.Validation
    } else if (statusCode === 429) {
      type = RootlyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RootlyErrorType.Server
      retryable = true
    }

    return new RootlyError(message, code, type, {
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
    return this.type === RootlyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RootlyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RootlyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RootlyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RootlyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RootlyErrorType.Server
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
