/**
 * 2chat Errors
 *
 * Auto-generated error handling for 2chat Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/_2chat
 */

/**
 * Error type enum
 */
export enum _2chatErrorType {
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
 * 2chat Error class
 *
 * Custom error class for 2chat Integration operations.
 */
export class _2chatError extends Error {
  public readonly code: string | number
  public readonly type: _2chatErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: _2chatErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = '_2chatError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _2chatError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns _2chatError instance
   */
  static fromError(error: any): _2chatError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: _2chatErrorType; retryable: boolean }> = {
      '401': { type: _2chatErrorType.Authentication, retryable: false },
      '429': { type: _2chatErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new _2chatError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = _2chatErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = _2chatErrorType.Authentication
    } else if (statusCode === 403) {
      type = _2chatErrorType.Authorization
    } else if (statusCode === 404) {
      type = _2chatErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = _2chatErrorType.Validation
    } else if (statusCode === 429) {
      type = _2chatErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = _2chatErrorType.Server
      retryable = true
    }

    return new _2chatError(message, code, type, {
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
    return this.type === _2chatErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === _2chatErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === _2chatErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === _2chatErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === _2chatErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === _2chatErrorType.Server
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
