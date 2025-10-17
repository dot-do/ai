/**
 * Omnisend Errors
 *
 * Auto-generated error handling for Omnisend Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/omnisend
 */

/**
 * Error type enum
 */
export enum OmnisendErrorType {
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
 * Omnisend Error class
 *
 * Custom error class for Omnisend Integration operations.
 */
export class OmnisendError extends Error {
  public readonly code: string | number
  public readonly type: OmnisendErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OmnisendErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OmnisendError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OmnisendError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OmnisendError instance
   */
  static fromError(error: any): OmnisendError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OmnisendErrorType; retryable: boolean }> = {
      '401': { type: OmnisendErrorType.Authentication, retryable: false },
      '429': { type: OmnisendErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OmnisendError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OmnisendErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OmnisendErrorType.Authentication
    } else if (statusCode === 403) {
      type = OmnisendErrorType.Authorization
    } else if (statusCode === 404) {
      type = OmnisendErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OmnisendErrorType.Validation
    } else if (statusCode === 429) {
      type = OmnisendErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OmnisendErrorType.Server
      retryable = true
    }

    return new OmnisendError(message, code, type, {
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
    return this.type === OmnisendErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OmnisendErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OmnisendErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OmnisendErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OmnisendErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OmnisendErrorType.Server
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
