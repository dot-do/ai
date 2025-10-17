/**
 * Semrush Errors
 *
 * Auto-generated error handling for Semrush Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/semrush
 */

/**
 * Error type enum
 */
export enum SemrushErrorType {
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
 * Semrush Error class
 *
 * Custom error class for Semrush Integration operations.
 */
export class SemrushError extends Error {
  public readonly code: string | number
  public readonly type: SemrushErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SemrushErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SemrushError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SemrushError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SemrushError instance
   */
  static fromError(error: any): SemrushError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SemrushErrorType; retryable: boolean }> = {
      '401': { type: SemrushErrorType.Authentication, retryable: false },
      '429': { type: SemrushErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SemrushError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SemrushErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SemrushErrorType.Authentication
    } else if (statusCode === 403) {
      type = SemrushErrorType.Authorization
    } else if (statusCode === 404) {
      type = SemrushErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SemrushErrorType.Validation
    } else if (statusCode === 429) {
      type = SemrushErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SemrushErrorType.Server
      retryable = true
    }

    return new SemrushError(message, code, type, {
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
    return this.type === SemrushErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SemrushErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SemrushErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SemrushErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SemrushErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SemrushErrorType.Server
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
