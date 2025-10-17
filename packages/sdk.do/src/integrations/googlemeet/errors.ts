/**
 * Google Meet Errors
 *
 * Auto-generated error handling for Google Meet Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googlemeet
 */

/**
 * Error type enum
 */
export enum GooglemeetErrorType {
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
 * Google Meet Error class
 *
 * Custom error class for Google Meet Integration operations.
 */
export class GooglemeetError extends Error {
  public readonly code: string | number
  public readonly type: GooglemeetErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GooglemeetErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GooglemeetError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GooglemeetError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GooglemeetError instance
   */
  static fromError(error: any): GooglemeetError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GooglemeetErrorType; retryable: boolean }> = {
      '401': { type: GooglemeetErrorType.Authentication, retryable: false },
      '429': { type: GooglemeetErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GooglemeetError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GooglemeetErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GooglemeetErrorType.Authentication
    } else if (statusCode === 403) {
      type = GooglemeetErrorType.Authorization
    } else if (statusCode === 404) {
      type = GooglemeetErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GooglemeetErrorType.Validation
    } else if (statusCode === 429) {
      type = GooglemeetErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GooglemeetErrorType.Server
      retryable = true
    }

    return new GooglemeetError(message, code, type, {
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
    return this.type === GooglemeetErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GooglemeetErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GooglemeetErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GooglemeetErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GooglemeetErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GooglemeetErrorType.Server
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
