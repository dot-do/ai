/**
 * Faceup Errors
 *
 * Auto-generated error handling for Faceup Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/faceup
 */

/**
 * Error type enum
 */
export enum FaceupErrorType {
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
 * Faceup Error class
 *
 * Custom error class for Faceup Integration operations.
 */
export class FaceupError extends Error {
  public readonly code: string | number
  public readonly type: FaceupErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FaceupErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FaceupError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FaceupError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FaceupError instance
   */
  static fromError(error: any): FaceupError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FaceupErrorType; retryable: boolean }> = {
      '401': { type: FaceupErrorType.Authentication, retryable: false },
      '429': { type: FaceupErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FaceupError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FaceupErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FaceupErrorType.Authentication
    } else if (statusCode === 403) {
      type = FaceupErrorType.Authorization
    } else if (statusCode === 404) {
      type = FaceupErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FaceupErrorType.Validation
    } else if (statusCode === 429) {
      type = FaceupErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FaceupErrorType.Server
      retryable = true
    }

    return new FaceupError(message, code, type, {
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
    return this.type === FaceupErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FaceupErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FaceupErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FaceupErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FaceupErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FaceupErrorType.Server
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
