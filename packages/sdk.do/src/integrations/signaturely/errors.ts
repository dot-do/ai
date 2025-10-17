/**
 * Signaturely Errors
 *
 * Auto-generated error handling for Signaturely Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/signaturely
 */

/**
 * Error type enum
 */
export enum SignaturelyErrorType {
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
 * Signaturely Error class
 *
 * Custom error class for Signaturely Integration operations.
 */
export class SignaturelyError extends Error {
  public readonly code: string | number
  public readonly type: SignaturelyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SignaturelyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SignaturelyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SignaturelyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SignaturelyError instance
   */
  static fromError(error: any): SignaturelyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SignaturelyErrorType; retryable: boolean }> = {
      '401': { type: SignaturelyErrorType.Authentication, retryable: false },
      '429': { type: SignaturelyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SignaturelyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SignaturelyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SignaturelyErrorType.Authentication
    } else if (statusCode === 403) {
      type = SignaturelyErrorType.Authorization
    } else if (statusCode === 404) {
      type = SignaturelyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SignaturelyErrorType.Validation
    } else if (statusCode === 429) {
      type = SignaturelyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SignaturelyErrorType.Server
      retryable = true
    }

    return new SignaturelyError(message, code, type, {
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
    return this.type === SignaturelyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SignaturelyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SignaturelyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SignaturelyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SignaturelyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SignaturelyErrorType.Server
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
