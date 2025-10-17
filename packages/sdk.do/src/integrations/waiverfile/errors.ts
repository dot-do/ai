/**
 * Waiverfile Errors
 *
 * Auto-generated error handling for Waiverfile Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/waiverfile
 */

/**
 * Error type enum
 */
export enum WaiverfileErrorType {
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
 * Waiverfile Error class
 *
 * Custom error class for Waiverfile Integration operations.
 */
export class WaiverfileError extends Error {
  public readonly code: string | number
  public readonly type: WaiverfileErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WaiverfileErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WaiverfileError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WaiverfileError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WaiverfileError instance
   */
  static fromError(error: any): WaiverfileError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WaiverfileErrorType; retryable: boolean }> = {
      '401': { type: WaiverfileErrorType.Authentication, retryable: false },
      '429': { type: WaiverfileErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WaiverfileError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WaiverfileErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WaiverfileErrorType.Authentication
    } else if (statusCode === 403) {
      type = WaiverfileErrorType.Authorization
    } else if (statusCode === 404) {
      type = WaiverfileErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WaiverfileErrorType.Validation
    } else if (statusCode === 429) {
      type = WaiverfileErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WaiverfileErrorType.Server
      retryable = true
    }

    return new WaiverfileError(message, code, type, {
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
    return this.type === WaiverfileErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WaiverfileErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WaiverfileErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WaiverfileErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WaiverfileErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WaiverfileErrorType.Server
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
