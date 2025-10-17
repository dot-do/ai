/**
 * Findymail Errors
 *
 * Auto-generated error handling for Findymail Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/findymail
 */

/**
 * Error type enum
 */
export enum FindymailErrorType {
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
 * Findymail Error class
 *
 * Custom error class for Findymail Integration operations.
 */
export class FindymailError extends Error {
  public readonly code: string | number
  public readonly type: FindymailErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FindymailErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FindymailError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FindymailError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FindymailError instance
   */
  static fromError(error: any): FindymailError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FindymailErrorType; retryable: boolean }> = {
      '401': { type: FindymailErrorType.Authentication, retryable: false },
      '429': { type: FindymailErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FindymailError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FindymailErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FindymailErrorType.Authentication
    } else if (statusCode === 403) {
      type = FindymailErrorType.Authorization
    } else if (statusCode === 404) {
      type = FindymailErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FindymailErrorType.Validation
    } else if (statusCode === 429) {
      type = FindymailErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FindymailErrorType.Server
      retryable = true
    }

    return new FindymailError(message, code, type, {
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
    return this.type === FindymailErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FindymailErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FindymailErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FindymailErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FindymailErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FindymailErrorType.Server
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
