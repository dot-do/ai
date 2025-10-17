/**
 * Bitwarden Errors
 *
 * Auto-generated error handling for Bitwarden Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bitwarden
 */

/**
 * Error type enum
 */
export enum BitwardenErrorType {
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
 * Bitwarden Error class
 *
 * Custom error class for Bitwarden Integration operations.
 */
export class BitwardenError extends Error {
  public readonly code: string | number
  public readonly type: BitwardenErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BitwardenErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BitwardenError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BitwardenError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BitwardenError instance
   */
  static fromError(error: any): BitwardenError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BitwardenErrorType; retryable: boolean }> = {
      '401': { type: BitwardenErrorType.Authentication, retryable: false },
      '429': { type: BitwardenErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BitwardenError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BitwardenErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BitwardenErrorType.Authentication
    } else if (statusCode === 403) {
      type = BitwardenErrorType.Authorization
    } else if (statusCode === 404) {
      type = BitwardenErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BitwardenErrorType.Validation
    } else if (statusCode === 429) {
      type = BitwardenErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BitwardenErrorType.Server
      retryable = true
    }

    return new BitwardenError(message, code, type, {
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
    return this.type === BitwardenErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BitwardenErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BitwardenErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BitwardenErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BitwardenErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BitwardenErrorType.Server
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
