/**
 * Spondyr Errors
 *
 * Auto-generated error handling for Spondyr Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/spondyr
 */

/**
 * Error type enum
 */
export enum SpondyrErrorType {
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
 * Spondyr Error class
 *
 * Custom error class for Spondyr Integration operations.
 */
export class SpondyrError extends Error {
  public readonly code: string | number
  public readonly type: SpondyrErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SpondyrErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SpondyrError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SpondyrError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SpondyrError instance
   */
  static fromError(error: any): SpondyrError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SpondyrErrorType; retryable: boolean }> = {
      '401': { type: SpondyrErrorType.Authentication, retryable: false },
      '429': { type: SpondyrErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SpondyrError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SpondyrErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SpondyrErrorType.Authentication
    } else if (statusCode === 403) {
      type = SpondyrErrorType.Authorization
    } else if (statusCode === 404) {
      type = SpondyrErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SpondyrErrorType.Validation
    } else if (statusCode === 429) {
      type = SpondyrErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SpondyrErrorType.Server
      retryable = true
    }

    return new SpondyrError(message, code, type, {
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
    return this.type === SpondyrErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SpondyrErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SpondyrErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SpondyrErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SpondyrErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SpondyrErrorType.Server
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
