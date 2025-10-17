/**
 * Google Classroom Errors
 *
 * Auto-generated error handling for Google Classroom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_classroom
 */

/**
 * Error type enum
 */
export enum GoogleClassroomErrorType {
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
 * Google Classroom Error class
 *
 * Custom error class for Google Classroom Integration operations.
 */
export class GoogleClassroomError extends Error {
  public readonly code: string | number
  public readonly type: GoogleClassroomErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleClassroomErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleClassroomError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleClassroomError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleClassroomError instance
   */
  static fromError(error: any): GoogleClassroomError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleClassroomErrorType; retryable: boolean }> = {
      '401': { type: GoogleClassroomErrorType.Authentication, retryable: false },
      '429': { type: GoogleClassroomErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleClassroomError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleClassroomErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleClassroomErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleClassroomErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleClassroomErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleClassroomErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleClassroomErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleClassroomErrorType.Server
      retryable = true
    }

    return new GoogleClassroomError(message, code, type, {
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
    return this.type === GoogleClassroomErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleClassroomErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleClassroomErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleClassroomErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleClassroomErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleClassroomErrorType.Server
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
