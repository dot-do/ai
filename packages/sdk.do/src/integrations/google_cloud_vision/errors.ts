/**
 * Google cloud vision Errors
 *
 * Auto-generated error handling for Google cloud vision Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_cloud_vision
 */

/**
 * Error type enum
 */
export enum GoogleCloudVisionErrorType {
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
 * Google cloud vision Error class
 *
 * Custom error class for Google cloud vision Integration operations.
 */
export class GoogleCloudVisionError extends Error {
  public readonly code: string | number
  public readonly type: GoogleCloudVisionErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleCloudVisionErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleCloudVisionError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleCloudVisionError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleCloudVisionError instance
   */
  static fromError(error: any): GoogleCloudVisionError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleCloudVisionErrorType; retryable: boolean }> = {
      '401': { type: GoogleCloudVisionErrorType.Authentication, retryable: false },
      '429': { type: GoogleCloudVisionErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleCloudVisionError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleCloudVisionErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleCloudVisionErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleCloudVisionErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleCloudVisionErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleCloudVisionErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleCloudVisionErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleCloudVisionErrorType.Server
      retryable = true
    }

    return new GoogleCloudVisionError(message, code, type, {
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
    return this.type === GoogleCloudVisionErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleCloudVisionErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleCloudVisionErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleCloudVisionErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleCloudVisionErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleCloudVisionErrorType.Server
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
