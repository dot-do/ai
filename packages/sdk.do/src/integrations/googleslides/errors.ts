/**
 * Google Slides Errors
 *
 * Auto-generated error handling for Google Slides Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googleslides
 */

/**
 * Error type enum
 */
export enum GoogleslidesErrorType {
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
 * Google Slides Error class
 *
 * Custom error class for Google Slides Integration operations.
 */
export class GoogleslidesError extends Error {
  public readonly code: string | number
  public readonly type: GoogleslidesErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleslidesErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleslidesError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleslidesError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleslidesError instance
   */
  static fromError(error: any): GoogleslidesError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleslidesErrorType; retryable: boolean }> = {
      '401': { type: GoogleslidesErrorType.Authentication, retryable: false },
      '429': { type: GoogleslidesErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleslidesError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleslidesErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleslidesErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleslidesErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleslidesErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleslidesErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleslidesErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleslidesErrorType.Server
      retryable = true
    }

    return new GoogleslidesError(message, code, type, {
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
    return this.type === GoogleslidesErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleslidesErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleslidesErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleslidesErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleslidesErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleslidesErrorType.Server
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
