/**
 * Bigml Errors
 *
 * Auto-generated error handling for Bigml Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bigml
 */

/**
 * Error type enum
 */
export enum BigmlErrorType {
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
 * Bigml Error class
 *
 * Custom error class for Bigml Integration operations.
 */
export class BigmlError extends Error {
  public readonly code: string | number
  public readonly type: BigmlErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BigmlErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BigmlError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BigmlError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BigmlError instance
   */
  static fromError(error: any): BigmlError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BigmlErrorType; retryable: boolean }> = {
      '401': { type: BigmlErrorType.Authentication, retryable: false },
      '429': { type: BigmlErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BigmlError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BigmlErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BigmlErrorType.Authentication
    } else if (statusCode === 403) {
      type = BigmlErrorType.Authorization
    } else if (statusCode === 404) {
      type = BigmlErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BigmlErrorType.Validation
    } else if (statusCode === 429) {
      type = BigmlErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BigmlErrorType.Server
      retryable = true
    }

    return new BigmlError(message, code, type, {
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
    return this.type === BigmlErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BigmlErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BigmlErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BigmlErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BigmlErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BigmlErrorType.Server
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
