/**
 * Brex Errors
 *
 * Auto-generated error handling for Brex Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brex
 */

/**
 * Error type enum
 */
export enum BrexErrorType {
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
 * Brex Error class
 *
 * Custom error class for Brex Integration operations.
 */
export class BrexError extends Error {
  public readonly code: string | number
  public readonly type: BrexErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrexErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrexError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrexError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrexError instance
   */
  static fromError(error: any): BrexError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrexErrorType; retryable: boolean }> = {
      '401': { type: BrexErrorType.Authentication, retryable: false },
      '429': { type: BrexErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrexError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrexErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrexErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrexErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrexErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrexErrorType.Validation
    } else if (statusCode === 429) {
      type = BrexErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrexErrorType.Server
      retryable = true
    }

    return new BrexError(message, code, type, {
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
    return this.type === BrexErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrexErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrexErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrexErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrexErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrexErrorType.Server
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
