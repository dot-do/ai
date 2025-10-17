/**
 * Google Admin Errors
 *
 * Auto-generated error handling for Google Admin Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_admin
 */

/**
 * Error type enum
 */
export enum GoogleAdminErrorType {
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
 * Google Admin Error class
 *
 * Custom error class for Google Admin Integration operations.
 */
export class GoogleAdminError extends Error {
  public readonly code: string | number
  public readonly type: GoogleAdminErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleAdminErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleAdminError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleAdminError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleAdminError instance
   */
  static fromError(error: any): GoogleAdminError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleAdminErrorType; retryable: boolean }> = {
      '401': { type: GoogleAdminErrorType.Authentication, retryable: false },
      '429': { type: GoogleAdminErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleAdminError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleAdminErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleAdminErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleAdminErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleAdminErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleAdminErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleAdminErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleAdminErrorType.Server
      retryable = true
    }

    return new GoogleAdminError(message, code, type, {
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
    return this.type === GoogleAdminErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleAdminErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleAdminErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleAdminErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleAdminErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleAdminErrorType.Server
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
