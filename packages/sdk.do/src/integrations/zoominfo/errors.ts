/**
 * Zoominfo Errors
 *
 * Auto-generated error handling for Zoominfo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoominfo
 */

/**
 * Error type enum
 */
export enum ZoominfoErrorType {
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
 * Zoominfo Error class
 *
 * Custom error class for Zoominfo Integration operations.
 */
export class ZoominfoError extends Error {
  public readonly code: string | number
  public readonly type: ZoominfoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZoominfoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZoominfoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZoominfoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZoominfoError instance
   */
  static fromError(error: any): ZoominfoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZoominfoErrorType; retryable: boolean }> = {
      '401': { type: ZoominfoErrorType.Authentication, retryable: false },
      '429': { type: ZoominfoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZoominfoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZoominfoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZoominfoErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZoominfoErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZoominfoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZoominfoErrorType.Validation
    } else if (statusCode === 429) {
      type = ZoominfoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZoominfoErrorType.Server
      retryable = true
    }

    return new ZoominfoError(message, code, type, {
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
    return this.type === ZoominfoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZoominfoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZoominfoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZoominfoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZoominfoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZoominfoErrorType.Server
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
