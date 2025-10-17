/**
 * Vero Errors
 *
 * Auto-generated error handling for Vero Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/vero
 */

/**
 * Error type enum
 */
export enum VeroErrorType {
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
 * Vero Error class
 *
 * Custom error class for Vero Integration operations.
 */
export class VeroError extends Error {
  public readonly code: string | number
  public readonly type: VeroErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: VeroErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'VeroError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VeroError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns VeroError instance
   */
  static fromError(error: any): VeroError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: VeroErrorType; retryable: boolean }> = {
      '401': { type: VeroErrorType.Authentication, retryable: false },
      '429': { type: VeroErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new VeroError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = VeroErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = VeroErrorType.Authentication
    } else if (statusCode === 403) {
      type = VeroErrorType.Authorization
    } else if (statusCode === 404) {
      type = VeroErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = VeroErrorType.Validation
    } else if (statusCode === 429) {
      type = VeroErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = VeroErrorType.Server
      retryable = true
    }

    return new VeroError(message, code, type, {
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
    return this.type === VeroErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === VeroErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === VeroErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === VeroErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === VeroErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === VeroErrorType.Server
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
