/**
 * Instagram Errors
 *
 * Auto-generated error handling for Instagram Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/instagram
 */

/**
 * Error type enum
 */
export enum InstagramErrorType {
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
 * Instagram Error class
 *
 * Custom error class for Instagram Integration operations.
 */
export class InstagramError extends Error {
  public readonly code: string | number
  public readonly type: InstagramErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: InstagramErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'InstagramError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InstagramError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns InstagramError instance
   */
  static fromError(error: any): InstagramError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: InstagramErrorType; retryable: boolean }> = {
      '401': { type: InstagramErrorType.Authentication, retryable: false },
      '429': { type: InstagramErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new InstagramError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = InstagramErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = InstagramErrorType.Authentication
    } else if (statusCode === 403) {
      type = InstagramErrorType.Authorization
    } else if (statusCode === 404) {
      type = InstagramErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = InstagramErrorType.Validation
    } else if (statusCode === 429) {
      type = InstagramErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = InstagramErrorType.Server
      retryable = true
    }

    return new InstagramError(message, code, type, {
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
    return this.type === InstagramErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === InstagramErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === InstagramErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === InstagramErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === InstagramErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === InstagramErrorType.Server
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
