/**
 * One drive Errors
 *
 * Auto-generated error handling for One drive Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/one_drive
 */

/**
 * Error type enum
 */
export enum OneDriveErrorType {
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
 * One drive Error class
 *
 * Custom error class for One drive Integration operations.
 */
export class OneDriveError extends Error {
  public readonly code: string | number
  public readonly type: OneDriveErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OneDriveErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OneDriveError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OneDriveError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OneDriveError instance
   */
  static fromError(error: any): OneDriveError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OneDriveErrorType; retryable: boolean }> = {
      '401': { type: OneDriveErrorType.Authentication, retryable: false },
      '429': { type: OneDriveErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OneDriveError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OneDriveErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OneDriveErrorType.Authentication
    } else if (statusCode === 403) {
      type = OneDriveErrorType.Authorization
    } else if (statusCode === 404) {
      type = OneDriveErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OneDriveErrorType.Validation
    } else if (statusCode === 429) {
      type = OneDriveErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OneDriveErrorType.Server
      retryable = true
    }

    return new OneDriveError(message, code, type, {
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
    return this.type === OneDriveErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OneDriveErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OneDriveErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OneDriveErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OneDriveErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OneDriveErrorType.Server
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
