/**
 * Onesignal user auth Errors
 *
 * Auto-generated error handling for Onesignal user auth Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onesignal_user_auth
 */

/**
 * Error type enum
 */
export enum OnesignalUserAuthErrorType {
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
 * Onesignal user auth Error class
 *
 * Custom error class for Onesignal user auth Integration operations.
 */
export class OnesignalUserAuthError extends Error {
  public readonly code: string | number
  public readonly type: OnesignalUserAuthErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OnesignalUserAuthErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OnesignalUserAuthError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OnesignalUserAuthError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OnesignalUserAuthError instance
   */
  static fromError(error: any): OnesignalUserAuthError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OnesignalUserAuthErrorType; retryable: boolean }> = {
      '401': { type: OnesignalUserAuthErrorType.Authentication, retryable: false },
      '429': { type: OnesignalUserAuthErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OnesignalUserAuthError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OnesignalUserAuthErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OnesignalUserAuthErrorType.Authentication
    } else if (statusCode === 403) {
      type = OnesignalUserAuthErrorType.Authorization
    } else if (statusCode === 404) {
      type = OnesignalUserAuthErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OnesignalUserAuthErrorType.Validation
    } else if (statusCode === 429) {
      type = OnesignalUserAuthErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OnesignalUserAuthErrorType.Server
      retryable = true
    }

    return new OnesignalUserAuthError(message, code, type, {
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
    return this.type === OnesignalUserAuthErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OnesignalUserAuthErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OnesignalUserAuthErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OnesignalUserAuthErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OnesignalUserAuthErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OnesignalUserAuthErrorType.Server
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
