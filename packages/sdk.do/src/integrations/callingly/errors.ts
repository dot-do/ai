/**
 * Callingly Errors
 *
 * Auto-generated error handling for Callingly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/callingly
 */

/**
 * Error type enum
 */
export enum CallinglyErrorType {
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
 * Callingly Error class
 *
 * Custom error class for Callingly Integration operations.
 */
export class CallinglyError extends Error {
  public readonly code: string | number
  public readonly type: CallinglyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CallinglyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CallinglyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CallinglyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CallinglyError instance
   */
  static fromError(error: any): CallinglyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CallinglyErrorType; retryable: boolean }> = {
      '401': { type: CallinglyErrorType.Authentication, retryable: false },
      '429': { type: CallinglyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CallinglyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CallinglyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CallinglyErrorType.Authentication
    } else if (statusCode === 403) {
      type = CallinglyErrorType.Authorization
    } else if (statusCode === 404) {
      type = CallinglyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CallinglyErrorType.Validation
    } else if (statusCode === 429) {
      type = CallinglyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CallinglyErrorType.Server
      retryable = true
    }

    return new CallinglyError(message, code, type, {
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
    return this.type === CallinglyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CallinglyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CallinglyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CallinglyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CallinglyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CallinglyErrorType.Server
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
