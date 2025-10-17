/**
 * Neverbounce Errors
 *
 * Auto-generated error handling for Neverbounce Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/neverbounce
 */

/**
 * Error type enum
 */
export enum NeverbounceErrorType {
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
 * Neverbounce Error class
 *
 * Custom error class for Neverbounce Integration operations.
 */
export class NeverbounceError extends Error {
  public readonly code: string | number
  public readonly type: NeverbounceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NeverbounceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NeverbounceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeverbounceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NeverbounceError instance
   */
  static fromError(error: any): NeverbounceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NeverbounceErrorType; retryable: boolean }> = {
      '401': { type: NeverbounceErrorType.Authentication, retryable: false },
      '429': { type: NeverbounceErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NeverbounceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NeverbounceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NeverbounceErrorType.Authentication
    } else if (statusCode === 403) {
      type = NeverbounceErrorType.Authorization
    } else if (statusCode === 404) {
      type = NeverbounceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NeverbounceErrorType.Validation
    } else if (statusCode === 429) {
      type = NeverbounceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NeverbounceErrorType.Server
      retryable = true
    }

    return new NeverbounceError(message, code, type, {
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
    return this.type === NeverbounceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NeverbounceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NeverbounceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NeverbounceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NeverbounceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NeverbounceErrorType.Server
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
