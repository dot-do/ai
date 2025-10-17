/**
 * Svix Errors
 *
 * Auto-generated error handling for Svix Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/svix
 */

/**
 * Error type enum
 */
export enum SvixErrorType {
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
 * Svix Error class
 *
 * Custom error class for Svix Integration operations.
 */
export class SvixError extends Error {
  public readonly code: string | number
  public readonly type: SvixErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SvixErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SvixError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SvixError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SvixError instance
   */
  static fromError(error: any): SvixError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SvixErrorType; retryable: boolean }> = {
      '401': { type: SvixErrorType.Authentication, retryable: false },
      '429': { type: SvixErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SvixError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SvixErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SvixErrorType.Authentication
    } else if (statusCode === 403) {
      type = SvixErrorType.Authorization
    } else if (statusCode === 404) {
      type = SvixErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SvixErrorType.Validation
    } else if (statusCode === 429) {
      type = SvixErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SvixErrorType.Server
      retryable = true
    }

    return new SvixError(message, code, type, {
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
    return this.type === SvixErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SvixErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SvixErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SvixErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SvixErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SvixErrorType.Server
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
