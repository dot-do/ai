/**
 * Canva Errors
 *
 * Auto-generated error handling for Canva Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/canva
 */

/**
 * Error type enum
 */
export enum CanvaErrorType {
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
 * Canva Error class
 *
 * Custom error class for Canva Integration operations.
 */
export class CanvaError extends Error {
  public readonly code: string | number
  public readonly type: CanvaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CanvaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CanvaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CanvaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CanvaError instance
   */
  static fromError(error: any): CanvaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CanvaErrorType; retryable: boolean }> = {
      '401': { type: CanvaErrorType.Authentication, retryable: false },
      '429': { type: CanvaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CanvaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CanvaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CanvaErrorType.Authentication
    } else if (statusCode === 403) {
      type = CanvaErrorType.Authorization
    } else if (statusCode === 404) {
      type = CanvaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CanvaErrorType.Validation
    } else if (statusCode === 429) {
      type = CanvaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CanvaErrorType.Server
      retryable = true
    }

    return new CanvaError(message, code, type, {
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
    return this.type === CanvaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CanvaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CanvaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CanvaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CanvaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CanvaErrorType.Server
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
