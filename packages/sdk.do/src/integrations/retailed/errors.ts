/**
 * Retailed Errors
 *
 * Auto-generated error handling for Retailed Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/retailed
 */

/**
 * Error type enum
 */
export enum RetailedErrorType {
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
 * Retailed Error class
 *
 * Custom error class for Retailed Integration operations.
 */
export class RetailedError extends Error {
  public readonly code: string | number
  public readonly type: RetailedErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RetailedErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RetailedError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RetailedError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RetailedError instance
   */
  static fromError(error: any): RetailedError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RetailedErrorType; retryable: boolean }> = {
      '401': { type: RetailedErrorType.Authentication, retryable: false },
      '429': { type: RetailedErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RetailedError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RetailedErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RetailedErrorType.Authentication
    } else if (statusCode === 403) {
      type = RetailedErrorType.Authorization
    } else if (statusCode === 404) {
      type = RetailedErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RetailedErrorType.Validation
    } else if (statusCode === 429) {
      type = RetailedErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RetailedErrorType.Server
      retryable = true
    }

    return new RetailedError(message, code, type, {
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
    return this.type === RetailedErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RetailedErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RetailedErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RetailedErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RetailedErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RetailedErrorType.Server
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
