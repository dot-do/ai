/**
 * Bigmailer Errors
 *
 * Auto-generated error handling for Bigmailer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bigmailer
 */

/**
 * Error type enum
 */
export enum BigmailerErrorType {
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
 * Bigmailer Error class
 *
 * Custom error class for Bigmailer Integration operations.
 */
export class BigmailerError extends Error {
  public readonly code: string | number
  public readonly type: BigmailerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BigmailerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BigmailerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BigmailerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BigmailerError instance
   */
  static fromError(error: any): BigmailerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BigmailerErrorType; retryable: boolean }> = {
      '401': { type: BigmailerErrorType.Authentication, retryable: false },
      '429': { type: BigmailerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BigmailerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BigmailerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BigmailerErrorType.Authentication
    } else if (statusCode === 403) {
      type = BigmailerErrorType.Authorization
    } else if (statusCode === 404) {
      type = BigmailerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BigmailerErrorType.Validation
    } else if (statusCode === 429) {
      type = BigmailerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BigmailerErrorType.Server
      retryable = true
    }

    return new BigmailerError(message, code, type, {
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
    return this.type === BigmailerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BigmailerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BigmailerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BigmailerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BigmailerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BigmailerErrorType.Server
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
