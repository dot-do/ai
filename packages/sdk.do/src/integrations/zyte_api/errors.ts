/**
 * Zyte api Errors
 *
 * Auto-generated error handling for Zyte api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zyte_api
 */

/**
 * Error type enum
 */
export enum ZyteApiErrorType {
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
 * Zyte api Error class
 *
 * Custom error class for Zyte api Integration operations.
 */
export class ZyteApiError extends Error {
  public readonly code: string | number
  public readonly type: ZyteApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZyteApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZyteApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZyteApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZyteApiError instance
   */
  static fromError(error: any): ZyteApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZyteApiErrorType; retryable: boolean }> = {
      '401': { type: ZyteApiErrorType.Authentication, retryable: false },
      '429': { type: ZyteApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZyteApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZyteApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZyteApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZyteApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZyteApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZyteApiErrorType.Validation
    } else if (statusCode === 429) {
      type = ZyteApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZyteApiErrorType.Server
      retryable = true
    }

    return new ZyteApiError(message, code, type, {
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
    return this.type === ZyteApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZyteApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZyteApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZyteApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZyteApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZyteApiErrorType.Server
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
