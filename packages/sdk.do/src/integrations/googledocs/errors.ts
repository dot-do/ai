/**
 * Google Docs Errors
 *
 * Auto-generated error handling for Google Docs Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googledocs
 */

/**
 * Error type enum
 */
export enum GoogledocsErrorType {
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
 * Google Docs Error class
 *
 * Custom error class for Google Docs Integration operations.
 */
export class GoogledocsError extends Error {
  public readonly code: string | number
  public readonly type: GoogledocsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogledocsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogledocsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogledocsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogledocsError instance
   */
  static fromError(error: any): GoogledocsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogledocsErrorType; retryable: boolean }> = {
      '401': { type: GoogledocsErrorType.Authentication, retryable: false },
      '429': { type: GoogledocsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogledocsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogledocsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogledocsErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogledocsErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogledocsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogledocsErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogledocsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogledocsErrorType.Server
      retryable = true
    }

    return new GoogledocsError(message, code, type, {
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
    return this.type === GoogledocsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogledocsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogledocsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogledocsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogledocsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogledocsErrorType.Server
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
