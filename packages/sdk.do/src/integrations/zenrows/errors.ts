/**
 * Zenrows Errors
 *
 * Auto-generated error handling for Zenrows Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zenrows
 */

/**
 * Error type enum
 */
export enum ZenrowsErrorType {
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
 * Zenrows Error class
 *
 * Custom error class for Zenrows Integration operations.
 */
export class ZenrowsError extends Error {
  public readonly code: string | number
  public readonly type: ZenrowsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZenrowsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZenrowsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZenrowsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZenrowsError instance
   */
  static fromError(error: any): ZenrowsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZenrowsErrorType; retryable: boolean }> = {
      '401': { type: ZenrowsErrorType.Authentication, retryable: false },
      '429': { type: ZenrowsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZenrowsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZenrowsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZenrowsErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZenrowsErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZenrowsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZenrowsErrorType.Validation
    } else if (statusCode === 429) {
      type = ZenrowsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZenrowsErrorType.Server
      retryable = true
    }

    return new ZenrowsError(message, code, type, {
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
    return this.type === ZenrowsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZenrowsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZenrowsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZenrowsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZenrowsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZenrowsErrorType.Server
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
