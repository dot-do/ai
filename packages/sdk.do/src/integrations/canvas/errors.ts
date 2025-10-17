/**
 * Canvas Errors
 *
 * Auto-generated error handling for Canvas Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/canvas
 */

/**
 * Error type enum
 */
export enum CanvasErrorType {
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
 * Canvas Error class
 *
 * Custom error class for Canvas Integration operations.
 */
export class CanvasError extends Error {
  public readonly code: string | number
  public readonly type: CanvasErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CanvasErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CanvasError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CanvasError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CanvasError instance
   */
  static fromError(error: any): CanvasError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CanvasErrorType; retryable: boolean }> = {
      '401': { type: CanvasErrorType.Authentication, retryable: false },
      '429': { type: CanvasErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CanvasError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CanvasErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CanvasErrorType.Authentication
    } else if (statusCode === 403) {
      type = CanvasErrorType.Authorization
    } else if (statusCode === 404) {
      type = CanvasErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CanvasErrorType.Validation
    } else if (statusCode === 429) {
      type = CanvasErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CanvasErrorType.Server
      retryable = true
    }

    return new CanvasError(message, code, type, {
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
    return this.type === CanvasErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CanvasErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CanvasErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CanvasErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CanvasErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CanvasErrorType.Server
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
