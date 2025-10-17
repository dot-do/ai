/**
 * Signpath Errors
 *
 * Auto-generated error handling for Signpath Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/signpath
 */

/**
 * Error type enum
 */
export enum SignpathErrorType {
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
 * Signpath Error class
 *
 * Custom error class for Signpath Integration operations.
 */
export class SignpathError extends Error {
  public readonly code: string | number
  public readonly type: SignpathErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SignpathErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SignpathError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SignpathError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SignpathError instance
   */
  static fromError(error: any): SignpathError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SignpathErrorType; retryable: boolean }> = {
      '401': { type: SignpathErrorType.Authentication, retryable: false },
      '429': { type: SignpathErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SignpathError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SignpathErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SignpathErrorType.Authentication
    } else if (statusCode === 403) {
      type = SignpathErrorType.Authorization
    } else if (statusCode === 404) {
      type = SignpathErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SignpathErrorType.Validation
    } else if (statusCode === 429) {
      type = SignpathErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SignpathErrorType.Server
      retryable = true
    }

    return new SignpathError(message, code, type, {
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
    return this.type === SignpathErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SignpathErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SignpathErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SignpathErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SignpathErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SignpathErrorType.Server
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
