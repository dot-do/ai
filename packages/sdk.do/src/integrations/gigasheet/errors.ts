/**
 * Gigasheet Errors
 *
 * Auto-generated error handling for Gigasheet Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gigasheet
 */

/**
 * Error type enum
 */
export enum GigasheetErrorType {
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
 * Gigasheet Error class
 *
 * Custom error class for Gigasheet Integration operations.
 */
export class GigasheetError extends Error {
  public readonly code: string | number
  public readonly type: GigasheetErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GigasheetErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GigasheetError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GigasheetError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GigasheetError instance
   */
  static fromError(error: any): GigasheetError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GigasheetErrorType; retryable: boolean }> = {
      '401': { type: GigasheetErrorType.Authentication, retryable: false },
      '429': { type: GigasheetErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GigasheetError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GigasheetErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GigasheetErrorType.Authentication
    } else if (statusCode === 403) {
      type = GigasheetErrorType.Authorization
    } else if (statusCode === 404) {
      type = GigasheetErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GigasheetErrorType.Validation
    } else if (statusCode === 429) {
      type = GigasheetErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GigasheetErrorType.Server
      retryable = true
    }

    return new GigasheetError(message, code, type, {
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
    return this.type === GigasheetErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GigasheetErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GigasheetErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GigasheetErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GigasheetErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GigasheetErrorType.Server
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
