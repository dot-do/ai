/**
 * Fixer io Errors
 *
 * Auto-generated error handling for Fixer io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/fixer_io
 */

/**
 * Error type enum
 */
export enum FixerIoErrorType {
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
 * Fixer io Error class
 *
 * Custom error class for Fixer io Integration operations.
 */
export class FixerIoError extends Error {
  public readonly code: string | number
  public readonly type: FixerIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FixerIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FixerIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FixerIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FixerIoError instance
   */
  static fromError(error: any): FixerIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FixerIoErrorType; retryable: boolean }> = {
      '401': { type: FixerIoErrorType.Authentication, retryable: false },
      '429': { type: FixerIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FixerIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FixerIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FixerIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = FixerIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = FixerIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FixerIoErrorType.Validation
    } else if (statusCode === 429) {
      type = FixerIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FixerIoErrorType.Server
      retryable = true
    }

    return new FixerIoError(message, code, type, {
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
    return this.type === FixerIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FixerIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FixerIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FixerIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FixerIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FixerIoErrorType.Server
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
