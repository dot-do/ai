/**
 * Canny Errors
 *
 * Auto-generated error handling for Canny Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/canny
 */

/**
 * Error type enum
 */
export enum CannyErrorType {
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
 * Canny Error class
 *
 * Custom error class for Canny Integration operations.
 */
export class CannyError extends Error {
  public readonly code: string | number
  public readonly type: CannyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CannyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CannyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CannyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CannyError instance
   */
  static fromError(error: any): CannyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CannyErrorType; retryable: boolean }> = {
      '401': { type: CannyErrorType.Authentication, retryable: false },
      '429': { type: CannyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CannyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CannyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CannyErrorType.Authentication
    } else if (statusCode === 403) {
      type = CannyErrorType.Authorization
    } else if (statusCode === 404) {
      type = CannyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CannyErrorType.Validation
    } else if (statusCode === 429) {
      type = CannyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CannyErrorType.Server
      retryable = true
    }

    return new CannyError(message, code, type, {
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
    return this.type === CannyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CannyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CannyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CannyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CannyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CannyErrorType.Server
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
