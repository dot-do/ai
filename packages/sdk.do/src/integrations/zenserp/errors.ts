/**
 * Zenserp Errors
 *
 * Auto-generated error handling for Zenserp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zenserp
 */

/**
 * Error type enum
 */
export enum ZenserpErrorType {
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
 * Zenserp Error class
 *
 * Custom error class for Zenserp Integration operations.
 */
export class ZenserpError extends Error {
  public readonly code: string | number
  public readonly type: ZenserpErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZenserpErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZenserpError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZenserpError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZenserpError instance
   */
  static fromError(error: any): ZenserpError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZenserpErrorType; retryable: boolean }> = {
      '401': { type: ZenserpErrorType.Authentication, retryable: false },
      '429': { type: ZenserpErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZenserpError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZenserpErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZenserpErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZenserpErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZenserpErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZenserpErrorType.Validation
    } else if (statusCode === 429) {
      type = ZenserpErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZenserpErrorType.Server
      retryable = true
    }

    return new ZenserpError(message, code, type, {
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
    return this.type === ZenserpErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZenserpErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZenserpErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZenserpErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZenserpErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZenserpErrorType.Server
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
