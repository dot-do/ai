/**
 * Cloudinary Errors
 *
 * Auto-generated error handling for Cloudinary Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cloudinary
 */

/**
 * Error type enum
 */
export enum CloudinaryErrorType {
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
 * Cloudinary Error class
 *
 * Custom error class for Cloudinary Integration operations.
 */
export class CloudinaryError extends Error {
  public readonly code: string | number
  public readonly type: CloudinaryErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CloudinaryErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CloudinaryError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CloudinaryError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CloudinaryError instance
   */
  static fromError(error: any): CloudinaryError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CloudinaryErrorType; retryable: boolean }> = {
      '401': { type: CloudinaryErrorType.Authentication, retryable: false },
      '429': { type: CloudinaryErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CloudinaryError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CloudinaryErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CloudinaryErrorType.Authentication
    } else if (statusCode === 403) {
      type = CloudinaryErrorType.Authorization
    } else if (statusCode === 404) {
      type = CloudinaryErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CloudinaryErrorType.Validation
    } else if (statusCode === 429) {
      type = CloudinaryErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CloudinaryErrorType.Server
      retryable = true
    }

    return new CloudinaryError(message, code, type, {
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
    return this.type === CloudinaryErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CloudinaryErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CloudinaryErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CloudinaryErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CloudinaryErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CloudinaryErrorType.Server
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
