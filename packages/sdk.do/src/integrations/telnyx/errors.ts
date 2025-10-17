/**
 * Telnyx Errors
 *
 * Auto-generated error handling for Telnyx Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/telnyx
 */

/**
 * Error type enum
 */
export enum TelnyxErrorType {
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
 * Telnyx Error class
 *
 * Custom error class for Telnyx Integration operations.
 */
export class TelnyxError extends Error {
  public readonly code: string | number
  public readonly type: TelnyxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TelnyxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TelnyxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TelnyxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TelnyxError instance
   */
  static fromError(error: any): TelnyxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TelnyxErrorType; retryable: boolean }> = {
      '401': { type: TelnyxErrorType.Authentication, retryable: false },
      '429': { type: TelnyxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TelnyxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TelnyxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TelnyxErrorType.Authentication
    } else if (statusCode === 403) {
      type = TelnyxErrorType.Authorization
    } else if (statusCode === 404) {
      type = TelnyxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TelnyxErrorType.Validation
    } else if (statusCode === 429) {
      type = TelnyxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TelnyxErrorType.Server
      retryable = true
    }

    return new TelnyxError(message, code, type, {
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
    return this.type === TelnyxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TelnyxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TelnyxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TelnyxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TelnyxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TelnyxErrorType.Server
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
