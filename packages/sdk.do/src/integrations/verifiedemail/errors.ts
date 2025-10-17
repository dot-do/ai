/**
 * Verifiedemail Errors
 *
 * Auto-generated error handling for Verifiedemail Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/verifiedemail
 */

/**
 * Error type enum
 */
export enum VerifiedemailErrorType {
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
 * Verifiedemail Error class
 *
 * Custom error class for Verifiedemail Integration operations.
 */
export class VerifiedemailError extends Error {
  public readonly code: string | number
  public readonly type: VerifiedemailErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: VerifiedemailErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'VerifiedemailError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VerifiedemailError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns VerifiedemailError instance
   */
  static fromError(error: any): VerifiedemailError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: VerifiedemailErrorType; retryable: boolean }> = {
      '401': { type: VerifiedemailErrorType.Authentication, retryable: false },
      '429': { type: VerifiedemailErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new VerifiedemailError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = VerifiedemailErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = VerifiedemailErrorType.Authentication
    } else if (statusCode === 403) {
      type = VerifiedemailErrorType.Authorization
    } else if (statusCode === 404) {
      type = VerifiedemailErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = VerifiedemailErrorType.Validation
    } else if (statusCode === 429) {
      type = VerifiedemailErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = VerifiedemailErrorType.Server
      retryable = true
    }

    return new VerifiedemailError(message, code, type, {
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
    return this.type === VerifiedemailErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === VerifiedemailErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === VerifiedemailErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === VerifiedemailErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === VerifiedemailErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === VerifiedemailErrorType.Server
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
