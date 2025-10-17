/**
 * Wachete Errors
 *
 * Auto-generated error handling for Wachete Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wachete
 */

/**
 * Error type enum
 */
export enum WacheteErrorType {
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
 * Wachete Error class
 *
 * Custom error class for Wachete Integration operations.
 */
export class WacheteError extends Error {
  public readonly code: string | number
  public readonly type: WacheteErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WacheteErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WacheteError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WacheteError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WacheteError instance
   */
  static fromError(error: any): WacheteError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WacheteErrorType; retryable: boolean }> = {
      '401': { type: WacheteErrorType.Authentication, retryable: false },
      '429': { type: WacheteErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WacheteError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WacheteErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WacheteErrorType.Authentication
    } else if (statusCode === 403) {
      type = WacheteErrorType.Authorization
    } else if (statusCode === 404) {
      type = WacheteErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WacheteErrorType.Validation
    } else if (statusCode === 429) {
      type = WacheteErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WacheteErrorType.Server
      retryable = true
    }

    return new WacheteError(message, code, type, {
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
    return this.type === WacheteErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WacheteErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WacheteErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WacheteErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WacheteErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WacheteErrorType.Server
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
