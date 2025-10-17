/**
 * Cloudcart Errors
 *
 * Auto-generated error handling for Cloudcart Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cloudcart
 */

/**
 * Error type enum
 */
export enum CloudcartErrorType {
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
 * Cloudcart Error class
 *
 * Custom error class for Cloudcart Integration operations.
 */
export class CloudcartError extends Error {
  public readonly code: string | number
  public readonly type: CloudcartErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CloudcartErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CloudcartError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CloudcartError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CloudcartError instance
   */
  static fromError(error: any): CloudcartError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CloudcartErrorType; retryable: boolean }> = {
      '401': { type: CloudcartErrorType.Authentication, retryable: false },
      '429': { type: CloudcartErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CloudcartError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CloudcartErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CloudcartErrorType.Authentication
    } else if (statusCode === 403) {
      type = CloudcartErrorType.Authorization
    } else if (statusCode === 404) {
      type = CloudcartErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CloudcartErrorType.Validation
    } else if (statusCode === 429) {
      type = CloudcartErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CloudcartErrorType.Server
      retryable = true
    }

    return new CloudcartError(message, code, type, {
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
    return this.type === CloudcartErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CloudcartErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CloudcartErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CloudcartErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CloudcartErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CloudcartErrorType.Server
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
