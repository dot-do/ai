/**
 * Bitquery Errors
 *
 * Auto-generated error handling for Bitquery Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bitquery
 */

/**
 * Error type enum
 */
export enum BitqueryErrorType {
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
 * Bitquery Error class
 *
 * Custom error class for Bitquery Integration operations.
 */
export class BitqueryError extends Error {
  public readonly code: string | number
  public readonly type: BitqueryErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BitqueryErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BitqueryError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BitqueryError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BitqueryError instance
   */
  static fromError(error: any): BitqueryError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BitqueryErrorType; retryable: boolean }> = {
      '401': { type: BitqueryErrorType.Authentication, retryable: false },
      '429': { type: BitqueryErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BitqueryError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BitqueryErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BitqueryErrorType.Authentication
    } else if (statusCode === 403) {
      type = BitqueryErrorType.Authorization
    } else if (statusCode === 404) {
      type = BitqueryErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BitqueryErrorType.Validation
    } else if (statusCode === 429) {
      type = BitqueryErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BitqueryErrorType.Server
      retryable = true
    }

    return new BitqueryError(message, code, type, {
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
    return this.type === BitqueryErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BitqueryErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BitqueryErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BitqueryErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BitqueryErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BitqueryErrorType.Server
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
