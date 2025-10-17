/**
 * Nango Errors
 *
 * Auto-generated error handling for Nango Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/nango
 */

/**
 * Error type enum
 */
export enum NangoErrorType {
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
 * Nango Error class
 *
 * Custom error class for Nango Integration operations.
 */
export class NangoError extends Error {
  public readonly code: string | number
  public readonly type: NangoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NangoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NangoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NangoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NangoError instance
   */
  static fromError(error: any): NangoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NangoErrorType; retryable: boolean }> = {
      '401': { type: NangoErrorType.Authentication, retryable: false },
      '429': { type: NangoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NangoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NangoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NangoErrorType.Authentication
    } else if (statusCode === 403) {
      type = NangoErrorType.Authorization
    } else if (statusCode === 404) {
      type = NangoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NangoErrorType.Validation
    } else if (statusCode === 429) {
      type = NangoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NangoErrorType.Server
      retryable = true
    }

    return new NangoError(message, code, type, {
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
    return this.type === NangoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NangoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NangoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NangoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NangoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NangoErrorType.Server
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
