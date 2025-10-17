/**
 * Google Drive Errors
 *
 * Auto-generated error handling for Google Drive Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googledrive
 */

/**
 * Error type enum
 */
export enum GoogledriveErrorType {
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
 * Google Drive Error class
 *
 * Custom error class for Google Drive Integration operations.
 */
export class GoogledriveError extends Error {
  public readonly code: string | number
  public readonly type: GoogledriveErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogledriveErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogledriveError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogledriveError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogledriveError instance
   */
  static fromError(error: any): GoogledriveError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogledriveErrorType; retryable: boolean }> = {
      '401': { type: GoogledriveErrorType.Authentication, retryable: false },
      '429': { type: GoogledriveErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogledriveError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogledriveErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogledriveErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogledriveErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogledriveErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogledriveErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogledriveErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogledriveErrorType.Server
      retryable = true
    }

    return new GoogledriveError(message, code, type, {
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
    return this.type === GoogledriveErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogledriveErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogledriveErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogledriveErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogledriveErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogledriveErrorType.Server
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
