/**
 * Callerapi Errors
 *
 * Auto-generated error handling for Callerapi Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/callerapi
 */

/**
 * Error type enum
 */
export enum CallerapiErrorType {
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
 * Callerapi Error class
 *
 * Custom error class for Callerapi Integration operations.
 */
export class CallerapiError extends Error {
  public readonly code: string | number
  public readonly type: CallerapiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CallerapiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CallerapiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CallerapiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CallerapiError instance
   */
  static fromError(error: any): CallerapiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CallerapiErrorType; retryable: boolean }> = {
      '401': { type: CallerapiErrorType.Authentication, retryable: false },
      '429': { type: CallerapiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CallerapiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CallerapiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CallerapiErrorType.Authentication
    } else if (statusCode === 403) {
      type = CallerapiErrorType.Authorization
    } else if (statusCode === 404) {
      type = CallerapiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CallerapiErrorType.Validation
    } else if (statusCode === 429) {
      type = CallerapiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CallerapiErrorType.Server
      retryable = true
    }

    return new CallerapiError(message, code, type, {
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
    return this.type === CallerapiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CallerapiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CallerapiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CallerapiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CallerapiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CallerapiErrorType.Server
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
