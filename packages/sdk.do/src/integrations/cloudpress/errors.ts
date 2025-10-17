/**
 * Cloudpress Errors
 *
 * Auto-generated error handling for Cloudpress Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cloudpress
 */

/**
 * Error type enum
 */
export enum CloudpressErrorType {
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
 * Cloudpress Error class
 *
 * Custom error class for Cloudpress Integration operations.
 */
export class CloudpressError extends Error {
  public readonly code: string | number
  public readonly type: CloudpressErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CloudpressErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CloudpressError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CloudpressError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CloudpressError instance
   */
  static fromError(error: any): CloudpressError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CloudpressErrorType; retryable: boolean }> = {
      '401': { type: CloudpressErrorType.Authentication, retryable: false },
      '429': { type: CloudpressErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CloudpressError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CloudpressErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CloudpressErrorType.Authentication
    } else if (statusCode === 403) {
      type = CloudpressErrorType.Authorization
    } else if (statusCode === 404) {
      type = CloudpressErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CloudpressErrorType.Validation
    } else if (statusCode === 429) {
      type = CloudpressErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CloudpressErrorType.Server
      retryable = true
    }

    return new CloudpressError(message, code, type, {
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
    return this.type === CloudpressErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CloudpressErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CloudpressErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CloudpressErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CloudpressErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CloudpressErrorType.Server
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
