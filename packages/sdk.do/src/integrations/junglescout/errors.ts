/**
 * Junglescout Errors
 *
 * Auto-generated error handling for Junglescout Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/junglescout
 */

/**
 * Error type enum
 */
export enum JunglescoutErrorType {
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
 * Junglescout Error class
 *
 * Custom error class for Junglescout Integration operations.
 */
export class JunglescoutError extends Error {
  public readonly code: string | number
  public readonly type: JunglescoutErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: JunglescoutErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'JunglescoutError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JunglescoutError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns JunglescoutError instance
   */
  static fromError(error: any): JunglescoutError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: JunglescoutErrorType; retryable: boolean }> = {
      '401': { type: JunglescoutErrorType.Authentication, retryable: false },
      '429': { type: JunglescoutErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new JunglescoutError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = JunglescoutErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = JunglescoutErrorType.Authentication
    } else if (statusCode === 403) {
      type = JunglescoutErrorType.Authorization
    } else if (statusCode === 404) {
      type = JunglescoutErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = JunglescoutErrorType.Validation
    } else if (statusCode === 429) {
      type = JunglescoutErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = JunglescoutErrorType.Server
      retryable = true
    }

    return new JunglescoutError(message, code, type, {
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
    return this.type === JunglescoutErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === JunglescoutErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === JunglescoutErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === JunglescoutErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === JunglescoutErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === JunglescoutErrorType.Server
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
