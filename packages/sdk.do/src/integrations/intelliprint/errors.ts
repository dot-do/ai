/**
 * Intelliprint Errors
 *
 * Auto-generated error handling for Intelliprint Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/intelliprint
 */

/**
 * Error type enum
 */
export enum IntelliprintErrorType {
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
 * Intelliprint Error class
 *
 * Custom error class for Intelliprint Integration operations.
 */
export class IntelliprintError extends Error {
  public readonly code: string | number
  public readonly type: IntelliprintErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: IntelliprintErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'IntelliprintError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IntelliprintError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns IntelliprintError instance
   */
  static fromError(error: any): IntelliprintError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: IntelliprintErrorType; retryable: boolean }> = {
      '401': { type: IntelliprintErrorType.Authentication, retryable: false },
      '429': { type: IntelliprintErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new IntelliprintError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = IntelliprintErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = IntelliprintErrorType.Authentication
    } else if (statusCode === 403) {
      type = IntelliprintErrorType.Authorization
    } else if (statusCode === 404) {
      type = IntelliprintErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = IntelliprintErrorType.Validation
    } else if (statusCode === 429) {
      type = IntelliprintErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = IntelliprintErrorType.Server
      retryable = true
    }

    return new IntelliprintError(message, code, type, {
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
    return this.type === IntelliprintErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === IntelliprintErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === IntelliprintErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === IntelliprintErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === IntelliprintErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === IntelliprintErrorType.Server
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
