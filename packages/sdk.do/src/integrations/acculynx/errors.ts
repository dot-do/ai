/**
 * Acculynx Errors
 *
 * Auto-generated error handling for Acculynx Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/acculynx
 */

/**
 * Error type enum
 */
export enum AcculynxErrorType {
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
 * Acculynx Error class
 *
 * Custom error class for Acculynx Integration operations.
 */
export class AcculynxError extends Error {
  public readonly code: string | number
  public readonly type: AcculynxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AcculynxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AcculynxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AcculynxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AcculynxError instance
   */
  static fromError(error: any): AcculynxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AcculynxErrorType; retryable: boolean }> = {
      '401': { type: AcculynxErrorType.Authentication, retryable: false },
      '429': { type: AcculynxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AcculynxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AcculynxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AcculynxErrorType.Authentication
    } else if (statusCode === 403) {
      type = AcculynxErrorType.Authorization
    } else if (statusCode === 404) {
      type = AcculynxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AcculynxErrorType.Validation
    } else if (statusCode === 429) {
      type = AcculynxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AcculynxErrorType.Server
      retryable = true
    }

    return new AcculynxError(message, code, type, {
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
    return this.type === AcculynxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AcculynxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AcculynxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AcculynxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AcculynxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AcculynxErrorType.Server
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
