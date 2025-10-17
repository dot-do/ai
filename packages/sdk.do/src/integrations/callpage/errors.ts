/**
 * Callpage Errors
 *
 * Auto-generated error handling for Callpage Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/callpage
 */

/**
 * Error type enum
 */
export enum CallpageErrorType {
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
 * Callpage Error class
 *
 * Custom error class for Callpage Integration operations.
 */
export class CallpageError extends Error {
  public readonly code: string | number
  public readonly type: CallpageErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CallpageErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CallpageError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CallpageError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CallpageError instance
   */
  static fromError(error: any): CallpageError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CallpageErrorType; retryable: boolean }> = {
      '401': { type: CallpageErrorType.Authentication, retryable: false },
      '429': { type: CallpageErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CallpageError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CallpageErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CallpageErrorType.Authentication
    } else if (statusCode === 403) {
      type = CallpageErrorType.Authorization
    } else if (statusCode === 404) {
      type = CallpageErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CallpageErrorType.Validation
    } else if (statusCode === 429) {
      type = CallpageErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CallpageErrorType.Server
      retryable = true
    }

    return new CallpageError(message, code, type, {
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
    return this.type === CallpageErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CallpageErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CallpageErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CallpageErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CallpageErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CallpageErrorType.Server
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
