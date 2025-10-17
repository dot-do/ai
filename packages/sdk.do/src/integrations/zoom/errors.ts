/**
 * Zoom Errors
 *
 * Auto-generated error handling for Zoom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoom
 */

/**
 * Error type enum
 */
export enum ZoomErrorType {
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
 * Zoom Error class
 *
 * Custom error class for Zoom Integration operations.
 */
export class ZoomError extends Error {
  public readonly code: string | number
  public readonly type: ZoomErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZoomErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZoomError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZoomError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZoomError instance
   */
  static fromError(error: any): ZoomError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZoomErrorType; retryable: boolean }> = {
      '124': { type: ZoomErrorType.Authentication, retryable: false },
      '200': { type: ZoomErrorType.Validation, retryable: false },
      '300': { type: ZoomErrorType.Validation, retryable: false },
      '3001': { type: ZoomErrorType.NotFound, retryable: false },
      '3003': { type: ZoomErrorType.Authorization, retryable: false },
      '429': { type: ZoomErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZoomError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZoomErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZoomErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZoomErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZoomErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZoomErrorType.Validation
    } else if (statusCode === 429) {
      type = ZoomErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZoomErrorType.Server
      retryable = true
    }

    return new ZoomError(message, code, type, {
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
    return this.type === ZoomErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZoomErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZoomErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZoomErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZoomErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZoomErrorType.Server
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
