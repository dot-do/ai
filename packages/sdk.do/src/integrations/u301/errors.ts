/**
 * U301 Errors
 *
 * Auto-generated error handling for U301 Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/u301
 */

/**
 * Error type enum
 */
export enum U301ErrorType {
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
 * U301 Error class
 *
 * Custom error class for U301 Integration operations.
 */
export class U301Error extends Error {
  public readonly code: string | number
  public readonly type: U301ErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: U301ErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'U301Error'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, U301Error)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns U301Error instance
   */
  static fromError(error: any): U301Error {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: U301ErrorType; retryable: boolean }> = {
      '401': { type: U301ErrorType.Authentication, retryable: false },
      '429': { type: U301ErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new U301Error(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = U301ErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = U301ErrorType.Authentication
    } else if (statusCode === 403) {
      type = U301ErrorType.Authorization
    } else if (statusCode === 404) {
      type = U301ErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = U301ErrorType.Validation
    } else if (statusCode === 429) {
      type = U301ErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = U301ErrorType.Server
      retryable = true
    }

    return new U301Error(message, code, type, {
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
    return this.type === U301ErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === U301ErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === U301ErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === U301ErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === U301ErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === U301ErrorType.Server
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
