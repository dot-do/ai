/**
 * Cdr platform Errors
 *
 * Auto-generated error handling for Cdr platform Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cdr_platform
 */

/**
 * Error type enum
 */
export enum CdrPlatformErrorType {
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
 * Cdr platform Error class
 *
 * Custom error class for Cdr platform Integration operations.
 */
export class CdrPlatformError extends Error {
  public readonly code: string | number
  public readonly type: CdrPlatformErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CdrPlatformErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CdrPlatformError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CdrPlatformError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CdrPlatformError instance
   */
  static fromError(error: any): CdrPlatformError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CdrPlatformErrorType; retryable: boolean }> = {
      '401': { type: CdrPlatformErrorType.Authentication, retryable: false },
      '429': { type: CdrPlatformErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CdrPlatformError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CdrPlatformErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CdrPlatformErrorType.Authentication
    } else if (statusCode === 403) {
      type = CdrPlatformErrorType.Authorization
    } else if (statusCode === 404) {
      type = CdrPlatformErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CdrPlatformErrorType.Validation
    } else if (statusCode === 429) {
      type = CdrPlatformErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CdrPlatformErrorType.Server
      retryable = true
    }

    return new CdrPlatformError(message, code, type, {
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
    return this.type === CdrPlatformErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CdrPlatformErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CdrPlatformErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CdrPlatformErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CdrPlatformErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CdrPlatformErrorType.Server
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
