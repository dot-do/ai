/**
 * Ninox Errors
 *
 * Auto-generated error handling for Ninox Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ninox
 */

/**
 * Error type enum
 */
export enum NinoxErrorType {
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
 * Ninox Error class
 *
 * Custom error class for Ninox Integration operations.
 */
export class NinoxError extends Error {
  public readonly code: string | number
  public readonly type: NinoxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NinoxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NinoxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NinoxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NinoxError instance
   */
  static fromError(error: any): NinoxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NinoxErrorType; retryable: boolean }> = {
      '401': { type: NinoxErrorType.Authentication, retryable: false },
      '429': { type: NinoxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NinoxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NinoxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NinoxErrorType.Authentication
    } else if (statusCode === 403) {
      type = NinoxErrorType.Authorization
    } else if (statusCode === 404) {
      type = NinoxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NinoxErrorType.Validation
    } else if (statusCode === 429) {
      type = NinoxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NinoxErrorType.Server
      retryable = true
    }

    return new NinoxError(message, code, type, {
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
    return this.type === NinoxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NinoxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NinoxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NinoxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NinoxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NinoxErrorType.Server
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
