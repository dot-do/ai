/**
 * Desktime Errors
 *
 * Auto-generated error handling for Desktime Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/desktime
 */

/**
 * Error type enum
 */
export enum DesktimeErrorType {
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
 * Desktime Error class
 *
 * Custom error class for Desktime Integration operations.
 */
export class DesktimeError extends Error {
  public readonly code: string | number
  public readonly type: DesktimeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DesktimeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DesktimeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DesktimeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DesktimeError instance
   */
  static fromError(error: any): DesktimeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DesktimeErrorType; retryable: boolean }> = {
      '401': { type: DesktimeErrorType.Authentication, retryable: false },
      '429': { type: DesktimeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DesktimeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DesktimeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DesktimeErrorType.Authentication
    } else if (statusCode === 403) {
      type = DesktimeErrorType.Authorization
    } else if (statusCode === 404) {
      type = DesktimeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DesktimeErrorType.Validation
    } else if (statusCode === 429) {
      type = DesktimeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DesktimeErrorType.Server
      retryable = true
    }

    return new DesktimeError(message, code, type, {
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
    return this.type === DesktimeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DesktimeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DesktimeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DesktimeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DesktimeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DesktimeErrorType.Server
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
