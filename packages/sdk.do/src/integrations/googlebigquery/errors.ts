/**
 * Google BigQuery Errors
 *
 * Auto-generated error handling for Google BigQuery Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googlebigquery
 */

/**
 * Error type enum
 */
export enum GooglebigqueryErrorType {
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
 * Google BigQuery Error class
 *
 * Custom error class for Google BigQuery Integration operations.
 */
export class GooglebigqueryError extends Error {
  public readonly code: string | number
  public readonly type: GooglebigqueryErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GooglebigqueryErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GooglebigqueryError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GooglebigqueryError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GooglebigqueryError instance
   */
  static fromError(error: any): GooglebigqueryError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GooglebigqueryErrorType; retryable: boolean }> = {
      '401': { type: GooglebigqueryErrorType.Authentication, retryable: false },
      '429': { type: GooglebigqueryErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GooglebigqueryError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GooglebigqueryErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GooglebigqueryErrorType.Authentication
    } else if (statusCode === 403) {
      type = GooglebigqueryErrorType.Authorization
    } else if (statusCode === 404) {
      type = GooglebigqueryErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GooglebigqueryErrorType.Validation
    } else if (statusCode === 429) {
      type = GooglebigqueryErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GooglebigqueryErrorType.Server
      retryable = true
    }

    return new GooglebigqueryError(message, code, type, {
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
    return this.type === GooglebigqueryErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GooglebigqueryErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GooglebigqueryErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GooglebigqueryErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GooglebigqueryErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GooglebigqueryErrorType.Server
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
