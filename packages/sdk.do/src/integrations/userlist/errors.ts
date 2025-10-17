/**
 * Userlist Errors
 *
 * Auto-generated error handling for Userlist Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/userlist
 */

/**
 * Error type enum
 */
export enum UserlistErrorType {
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
 * Userlist Error class
 *
 * Custom error class for Userlist Integration operations.
 */
export class UserlistError extends Error {
  public readonly code: string | number
  public readonly type: UserlistErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: UserlistErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'UserlistError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserlistError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns UserlistError instance
   */
  static fromError(error: any): UserlistError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: UserlistErrorType; retryable: boolean }> = {
      '401': { type: UserlistErrorType.Authentication, retryable: false },
      '429': { type: UserlistErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new UserlistError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = UserlistErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = UserlistErrorType.Authentication
    } else if (statusCode === 403) {
      type = UserlistErrorType.Authorization
    } else if (statusCode === 404) {
      type = UserlistErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = UserlistErrorType.Validation
    } else if (statusCode === 429) {
      type = UserlistErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = UserlistErrorType.Server
      retryable = true
    }

    return new UserlistError(message, code, type, {
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
    return this.type === UserlistErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === UserlistErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === UserlistErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === UserlistErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === UserlistErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === UserlistErrorType.Server
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
