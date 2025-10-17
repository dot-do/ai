/**
 * Heygen Errors
 *
 * Auto-generated error handling for Heygen Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/heygen
 */

/**
 * Error type enum
 */
export enum HeygenErrorType {
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
 * Heygen Error class
 *
 * Custom error class for Heygen Integration operations.
 */
export class HeygenError extends Error {
  public readonly code: string | number
  public readonly type: HeygenErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HeygenErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HeygenError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HeygenError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HeygenError instance
   */
  static fromError(error: any): HeygenError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HeygenErrorType; retryable: boolean }> = {
      '401': { type: HeygenErrorType.Authentication, retryable: false },
      '429': { type: HeygenErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HeygenError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HeygenErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HeygenErrorType.Authentication
    } else if (statusCode === 403) {
      type = HeygenErrorType.Authorization
    } else if (statusCode === 404) {
      type = HeygenErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HeygenErrorType.Validation
    } else if (statusCode === 429) {
      type = HeygenErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HeygenErrorType.Server
      retryable = true
    }

    return new HeygenError(message, code, type, {
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
    return this.type === HeygenErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HeygenErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HeygenErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HeygenErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HeygenErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HeygenErrorType.Server
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
